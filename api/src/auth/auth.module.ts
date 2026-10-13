import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshToken } from './entities/refresh-token.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule.register({defaultStrategy:'local'}),TypeOrmModule.forFeature([RefreshToken]), JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService], 
    useFactory: async (configService:ConfigService) => ({
      secret: configService.get<string>('jwt_secret'),
      signOptions: {expiresIn: '15m'}
    })
  })] , 
  providers: [AuthService,LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
