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
import { JwtStrategy } from './jwt.strategy';
import { EmailVerificationChallenge } from './entities/email-verification-challenge.entity';
import { BullModule } from '@nestjs/bullmq';
import {  ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { MailModule } from '../mail/mail.module';
import { EmailThrottlerGuard } from './email-throttler.guard';

@Module({
  imports: [UsersModule, PassportModule.register({defaultStrategy:'local'}),
    TypeOrmModule.forFeature([RefreshToken,EmailVerificationChallenge]), 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService], 
      useFactory: async (configService:ConfigService) => ({
        secret: configService.get<string>('jwt_secret'),
        signOptions: {expiresIn: '15m'}
      })
  }),
  MailModule,
  // BullModule.registerQueue({
  //   name:"email"
  // }),
  ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 10 },
  ]),
] , 
  providers: [AuthService,LocalStrategy, JwtStrategy,
     { provide: APP_GUARD, useClass: EmailThrottlerGuard }
  ],
  controllers: [AuthController]
})
export class AuthModule {}
