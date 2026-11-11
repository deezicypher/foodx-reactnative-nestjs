import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { MAIL_QUEUE, SEND_FORGOT_PASSWORD_CODE, SEND_VERIFICATION_CODE, VerificationMailJob } from "./mail.constants";
import { Queue } from "bullmq";
import { VerificationPurpose } from "../auth/entities/email-verification-challenge.entity";

@Injectable()
export class MailProducer{
    constructor(
        @InjectQueue(MAIL_QUEUE)
        private readonly queue: Queue<VerificationMailJob>
    ){}

    sendVerificationCode(to:string,name:string,code:string,
        purpose:VerificationPurpose, challengeId:string){
        switch(purpose){
            case VerificationPurpose.REGISTRATION:
                return this.queue.add(SEND_VERIFICATION_CODE, {to,name,code,purpose,challengeId})
            case VerificationPurpose.PASSWORD_RESET:
                return this.queue.add(SEND_FORGOT_PASSWORD_CODE, {to,name,code,purpose,challengeId})
            default:
                throw new Error(`Unsupported verification purpose: ${purpose}`)
        }

    }
}