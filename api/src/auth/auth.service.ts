import { BadRequestException, ForbiddenException, HttpException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { DataSource, Repository } from 'typeorm';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { EmailVerificationChallenge, VerificationPurpose } from './entities/email-verification-challenge.entity';
import {InjectQueue} from '@nestjs/bullmq'
import { Queue } from 'bullmq';
import { generateVerificationCode, hashVerificationCode, matchesVerificationCode } from './utils/verification-code';
import { ConfigService } from '@nestjs/config';
import { VerifyRegistrationDto } from './dto/verfiyReg.dto';
import { ResendDto } from './dto/resend.dto';
import { MailProducer } from '../mail/mail.producer';
import { ResendCooldownException } from './verification.errors';


@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UsersService,
        @InjectRepository(RefreshToken)
        private readonly refreshTokRepo: Repository<RefreshToken>,
        private  readonly jwtService: JwtService,
        @InjectRepository(EmailVerificationChallenge)
        private readonly challengesRepo: Repository<EmailVerificationChallenge>,
        // @InjectQueue('email')
        // private readonly emailQueue: Queue,
        private readonly dataSource: DataSource,
        private mailProducer:MailProducer

    ){}

    private generateRefreshToken():string {
        return randomBytes(64).toString('base64url')
    }

    private hashRefreshToken(token: string): string {
        return createHash('sha256')
                .update(token)
                .digest('hex');
    }

    private async revokeFamilyToken(familyId: string): Promise<void>{
        await this.refreshTokRepo.update({familyId},{revokedAt: new Date()})
    }

    private async revokeToken(tokenHash: string): Promise<void>{
        await this.refreshTokRepo.update({
            tokenHash
        },{revokedAt: new Date()})
    }

    private async createTokenPair(user: User){
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email
        });
        const refreshToken = this.generateRefreshToken();
        const tokenHash = this.hashRefreshToken(refreshToken);
        const familyId = randomUUID();

        const expiresAt = new Date( 
            Date.now() + 30 * 24 * 60 * 60 * 1000
        );
        
        const familyExpiresAt = new Date(
             Date.now() + 90 * 24 * 60 * 60 * 1000
        )

        const refreshTokenEntity = this.refreshTokRepo.create({
            tokenHash,
            familyId,
            expiresAt,
            familyExpiresAt,
            userId:user.id
        })

        await this.refreshTokRepo.save(refreshTokenEntity)
        return {
            accessToken,
            refreshToken
        }
    }

    private async createRotatedTokenPair( user:User, familyId:string, 
        familyExpiresAt : Date){
       const accessToken = this.jwtService.sign({
        sub:user.id,
        email:user.email
       });

       const refreshToken = this.generateRefreshToken();
       const tokenHash = this.hashRefreshToken(refreshToken);

       const expiresAt = new Date( 
            Date.now() + 30 * 24 * 60 * 60 * 1000
        );

        const refreshTokenEntity = this.refreshTokRepo.create({
            tokenHash,expiresAt,familyId,familyExpiresAt,userId:user.id
        })

        await this.refreshTokRepo.save(refreshTokenEntity)

        return {
            accessToken,
            refreshToken,
            user
        }
    }

    async validateUser(email:string, pass:string): Promise<any>{
        const user = await this.userService.findOneByEmail(email)
        if(!user) throw new NotFoundException("Invalid credentials ")
        
        if(!user.isEmailVerified)  throw new ForbiddenException({
                code: 'EMAIL_NOT_VERIFIED',
                message: 'Please verify your email before signing in.',
            });
        
        const passwordMatched = await bcrypt.compare(pass,user.password)
        if(!passwordMatched) throw new UnauthorizedException('Invalid credentials')
        
        return user
    }

    async login(user:User){
        if(!user.isEmailVerified){
            await this.issueChallenge(user.id,VerificationPurpose.REGISTRATION).catch(() => {})
            throw new ForbiddenException({
                code: "EMAIL_NOT_VERIFIED",
                message: 'Please verify your email to continue',
                email: user.email
            })
        }
        const tokens = await this.createTokenPair(user)
        return {user,...tokens}
    }

    async refresh(refreshToken:string){
        const tokenHash = this.hashRefreshToken(refreshToken)

        const storedToken = await this.refreshTokRepo.findOneBy({tokenHash})

        if(!storedToken) throw new UnauthorizedException('Invalid refresh token')
        
        if(storedToken.revokedAt) {
            await this.revokeFamilyToken(storedToken.familyId)
            throw new UnauthorizedException('Refresh token reuse detected');
        }

        if(storedToken.usedAt){
            await this.revokeFamilyToken(storedToken.familyId)
            throw new UnauthorizedException('Refresh token reuse detected');
        }

        if(storedToken.expiresAt < new Date()){
            throw new UnauthorizedException('Refresh token expired');
        }

        if(storedToken.familyExpiresAt < new Date()){
            await this.revokeFamilyToken(storedToken.familyId)
            throw new UnauthorizedException('Session expired');
        }

        storedToken.usedAt = new Date()

        await this.refreshTokRepo.save(storedToken)

        const user = await this.userService.findOne(storedToken.userId)

        if (!user) {
            throw new UnauthorizedException();
        }

        return this.createRotatedTokenPair(user,
            storedToken.familyId, storedToken.familyExpiresAt)
    }

    async issueChallenge(
        userId: string,
        purpose: VerificationPurpose,
        targetEmail?: string,
    ): Promise<any>{
        const last = await this.challengesRepo.findOne({
            where:{userId},
            order: {createdAt: 'DESC'}
        })

        const RESEND_COOLDOWN_MS = 30 * 1000;
        if(last){
            const elapsed =  Date.now() - last.createdAt.getTime()
            if (elapsed < RESEND_COOLDOWN_MS) {
                // throw new HttpException('Please wait before requesting another code', 429,);
                throw new ResendCooldownException(Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000))
            }
        }
        const code = generateVerificationCode();
        const challengeId = randomUUID();

        const secret = this.configService.get<string>('email_secret')
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

        const normalizedTarget = targetEmail?targetEmail.trim().toLowerCase() : null;

        const result = await this.dataSource.transaction(async(manager) => {
            const userRepo = manager.getRepository(User)
            const challengeRepo = manager.getRepository(EmailVerificationChallenge)

            const user = await userRepo
                    .createQueryBuilder('u')
                    .setLock('pessimistic_write')
                    .where('u.id = :userId', {userId})
                    .getOne();
            
            if(!user) throw new NotFoundException('User not found')


            
            if(
                purpose === VerificationPurpose.REGISTRATION &&
                user.isEmailVerified
            ){
                throw new BadRequestException('This account is already verified')

            };

            if(
                purpose === VerificationPurpose.EMAIL_CHANGE &&
                (
                    !normalizedTarget || normalizedTarget === user.email.toLowerCase()
                )
            ) throw new BadRequestException('Provide a different email address')

            if(
                purpose === VerificationPurpose.PASSWORD_RESET &&
                !user.email
            ) throw new BadRequestException('Password reset is unavailable')
                
            if(purpose === VerificationPurpose.EMAIL_CHANGE && targetEmail){
                user.pendingEmail = normalizedTarget
                await userRepo.save(user)
            }
            // Retire any previous unconsumed challenge for this
            // user and purpose before inserting the replacement.

            await challengeRepo
                    .createQueryBuilder()
                    .update(EmailVerificationChallenge)
                    .set({consumedAt: new Date()})
                    .where('"userId" = :userId', {userId})
                    .andWhere('"purpose" = :purpose', {purpose})
                    .andWhere('"consumedAt" IS NULL')
                    .execute();
            
            const challenge = challengeRepo.create({
                id: challengeId,
                userId,
                purpose,
                targetEmail: purpose === VerificationPurpose.EMAIL_CHANGE?
                    normalizedTarget : user.email.trim().toLowerCase(),
                codeHash: hashVerificationCode(userId, challengeId, code,secret!),
                attempts:0,
                expiresAt,
                consumedAt: null
            })
             await challengeRepo.save(challenge)
             return {
                email:
                    purpose === VerificationPurpose.EMAIL_CHANGE?
                    normalizedTarget!
                    : user.email,
                code,
                challengeId,
                name:user.name
             }
        })
        

        await this.mailProducer.sendVerificationCode(result.email,result.name,
            result.code,purpose,result.challengeId)
      
        return {
            email:result.email
        }
        // await this.emailQueue.add('verify-email',
        //     {
        //         email:result.email,
        //         code: result.code,
        //         purpose,
        //         challengeId: result.challengeId
        //     },
        //     {
        //         attempts:5,
        //         backoff: {type: 'exponential', delay: 1000},
        //         removeOnComplete: true,
        //         removeOnFail: {age: 7 * 24 * 3600}
        //     }
        // )

    }

    async verifyChallenge(
        userId:string,
        purpose: VerificationPurpose,
        submittedCode: string,
    ): Promise<void> {
        if(purpose === VerificationPurpose.PASSWORD_RESET) throw new BadRequestException(
            'Use the password-reset verification flow'
        )
        const secret = this.configService.getOrThrow<string>('email_secret')

        const result = await this.dataSource.transaction(
            async (manager) => {
                const userRepo = manager.getRepository(User)
                const challengeRepo = manager.getRepository(EmailVerificationChallenge)
                
                // Always lock the user before the challenge. Issuance
                // uses the same lock order.
                const user = await userRepo
                        .createQueryBuilder('u')
                        .setLock('pessimistic_write')
                        .where('u.id = :userId', {userId})
                        .getOne();
                
                
                if(!user) return {ok: false as const}

                if(purpose === VerificationPurpose.REGISTRATION &&
                    user.isEmailVerified
                ) return {ok: false as const}
            
                const challenge = await challengeRepo
                                    .createQueryBuilder('C')
                                    .setLock('pessimistic_write')
                                    .where('c.userId = :userId', {userId})
                                    .andWhere('c.purpose = :purpose', {purpose})
                                    .andWhere('"c"."consumedAt" IS NULL')
                                    .orderBy('c.createdAt', 'DESC')
                                    .getOne();
                if(
                    !challenge || 
                    challenge.expiresAt.getTime() <=  Date.now()
                    || challenge.attempts >= 5
                ) return {ok: false as const}

                const submittedHash = hashVerificationCode(userId,
                    challenge.id, submittedCode, secret
                )

                const matches = matchesVerificationCode(submittedHash, challenge.codeHash);

                if(!matches){
                    challenge.attempts += 1

                    if(challenge.attempts >= 5){
                        challenge.consumedAt = new Date();
                    }
                    await challengeRepo.save(challenge)
                    return {ok: false as const}
                }

                if(
                    purpose === VerificationPurpose.EMAIL_CHANGE && 
                    (
                        !challenge.targetEmail ||
                        !user.pendingEmail ||
                        challenge.targetEmail !== user.pendingEmail
                    )
                ) return {ok: false as const}

                challenge.consumedAt = new Date();

                if(purpose === VerificationPurpose.REGISTRATION){
                    user.isEmailVerified = true
                } else if(purpose === VerificationPurpose.EMAIL_CHANGE){
                    user.email = challenge.targetEmail!;
                    user.pendingEmail = null
                }

                await challengeRepo.save(challenge)
                await userRepo.save(user)

                return {ok: true as const}
        }
        )
        if(!result.ok){
            throw new BadRequestException(
                'Invalid or expired verification code'
            )
        }
    }


    async register(dto:CreateUserDto): Promise<any>{
        const savedUser = await this.userService.create(dto) 
        
        try {
            return await this.issueChallenge(savedUser.id,VerificationPurpose.REGISTRATION)
        } catch (err) {
            if (err instanceof ResendCooldownException) return false; // a code is already on its way
            throw err; 
        }
    }

    async resendVerify(dto: ResendDto){
        const email = dto.email.trim().toLowerCase()
        const user = await this.userService.findOneByEmail(email)
        if(!user) throw new BadRequestException('Invalid or expired verification code')
        
        return this.issueChallenge(user.id,VerificationPurpose.REGISTRATION,email)
    }

    async verifyReg(dto:VerifyRegistrationDto){
        const email = dto.email.trim().toLowerCase()
        const user = await this.userService.findOneByEmail(email)
        if(!user) throw new BadRequestException('Invalid or expired verification code')
        
        await this.verifyChallenge(user.id,VerificationPurpose.REGISTRATION,dto.code)

        return {
            msg: "Email verified successfully"
        }
    }
}
