import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './db/data-source';


export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.development`],
      isGlobal: true,
      override:true, // overwrite environment variables that already exist in process.env
      skipProcessEnv: true, // skips falling back to process.env
      load:[configuration],
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'api',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
