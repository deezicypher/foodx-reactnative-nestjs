import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {

    constructor(
        private readonly mailerService: MailerService
    ){}

    async sendVerificationCode(to: string, name:string, code: string) {
    const { error } = await this.mailerService.sendMail({
    //   from: this.config.getOrThrow('MAIL_FROM'),
      to,
      subject: `${code} is your verification code`,
      template: 'verify-email',
      text: `Your verification code is ${code}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
      context: {
        code,
        name,
        privacyUrl:    'https://foodx/privacy',
        supportUrl:    'https://foodx/support',
        year:          new Date().getFullYear(),
      }
    });

    if (error) throw new Error(error.message);
  }
}
