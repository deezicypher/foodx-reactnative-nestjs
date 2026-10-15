import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { BullModule } from '@nestjs/bullmq';
import { MAIL_QUEUE } from './mail.constants';
import {MailerModule} from '@nestjs-modules/mailer'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { MailProcessor } from './mail.processor';
import { MailProducer } from './mail.producer';


@Module({
  imports:[
    BullModule.registerQueue({
      name: MAIL_QUEUE
    }),
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (config:ConfigService) => ({
        transport: {
          host: config.get<string>('mail_host'),
          port: config.get<number>('mail_port'),
          auth: {
            user: config.get<string>('mail_user'),
            pass: config.get<string>('mail_pass')
        },
        maxConnections:5,
        pool:true, // reuse connections instead of reconnecting per email
        defaults:{
          from : config.getOrThrow<string>('MAIL_FROM'),
        }
        },
        template:{
          dir: join(process.cwd(), 'src/mail/templates'), // path to .hbs files
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        }
        })
    })
  ],
  providers: [MailService,MailProcessor,MailProducer],
  exports: [MailProducer]
})
export class MailModule {}
