import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from 'bcryptjs'


@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService
    ){}


    async validateUser(email:string, pass:string): Promise<any>{
        const user = await this.userService.findOneByEmail(email)
        if(!user) throw new NotFoundException("Invalid credentials ")
        
        if(!user.isEmailVerified) throw new UnauthorizedException("Verify your email before signing in.")
        
        const passwordMatched = await bcrypt.compare(pass,user.password)
        if(!passwordMatched) throw new UnauthorizedException('Invalid credentials')
        
        return user
    }
}
