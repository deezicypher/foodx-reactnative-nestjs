import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { VerifyRegistrationDto } from './dto/verfiyReg.dto';
import { ResendDto } from './dto/resend.dto';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Body() dto:LoginDTO, @Req() req:any){
        return this.authService.login(req.user)
    }

    @Post('register')
    async register(@Body() dto: CreateUserDto){
        return this.authService.register(dto) 
    }

    @Post('refresh')
    async refresh(@Body('refreshToken') refreshToken:string){
        return this.authService.refresh(refreshToken)
    }

    @Post('resend-verification')
    @HttpCode(202)
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    async resend(@Body() dto: ResendDto) {
        await this.authService.resendVerify(dto);
        return { message: 'If the account exists, a new code has been sent.' };
    }

    @Post('verify-email')
    @HttpCode(200)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async verify(@Body() dto: VerifyRegistrationDto){
        return this.authService.verifyReg(dto)
    }
}
