import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { MAIL_QUEUE, SEND_VERIFICATION_CODE, VerificationMailJob } from "./mail.constants";
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
        return this.queue.add(SEND_VERIFICATION_CODE, {to,name,code,purpose,challengeId})
    }
}