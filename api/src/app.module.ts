import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from './env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './db/data-source';
import { AuthModule } from './auth/auth.module';
import { BullModule } from '@nestjs/bullmq';
import { MailModule } from './mail/mail.module';


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
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow('REDIS_HOST'),
          port: Number(config.getOrThrow('REDIS_PORT')),
          password: config.get('REDIS_PASSWORD'),
          ...(config.get('REDIS_TLS') === 'true' ? { tls: {} } : {}),
        },
        defaultJobOptions: {
          attempts: 5,                                   // try up to 5 times
          backoff: { type: 'exponential', delay: 2000 }, // wait 2s, 4s, 8s...
          removeOnComplete: true,                        // don't keep finished jobs
          removeOnFail: { age: 3600 },                   // keep failures for 1 hour
        },
      }),
    }),
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'api',
    // }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
