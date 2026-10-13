import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs'
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        @InjectRepository(RefreshToken)
        private refreshTokRepo: Repository<RefreshToken>,
        private jwtService: JwtService
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
        
        if(!user.isEmailVerified) throw new UnauthorizedException("Verify your email before signing in.")
        
        const passwordMatched = await bcrypt.compare(pass,user.password)
        if(!passwordMatched) throw new UnauthorizedException('Invalid credentials')
        
        return user
    }

    async login(user:any){
        const tokens = await this.createTokenPair(user)
        return {user,...tokens}
    }
}
