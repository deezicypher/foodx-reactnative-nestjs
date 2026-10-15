import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { MAIL_QUEUE, SEND_VERIFICATION_CODE, VerificationMailJob } from "./mail.constants";
import { Logger } from "@nestjs/common";
import { MailService } from "./mail.service";
import { Job } from "bullmq";

@Processor(MAIL_QUEUE, {concurrency: 5})
export class MailProcessor extends WorkerHost{
    private readonly logger = new Logger(MailProcessor.name);

    constructor(
        private readonly mailService:MailService
    ){
        super()
    }

    async process(job: Job<VerificationMailJob>): Promise<any> {
        switch(job.name){
            case SEND_VERIFICATION_CODE:
                return this.mailService.sendVerificationCode(
                    job.data.to,job.data.name, job.data.code
                );
            default:
                this.logger.warn('Unknown job name: ${job.name}')
        }
        
    }

    @OnWorkerEvent('failed')
    onFailed(job:Job, err:Error){
        const finalAttempt = job.attemptsMade >= (job.opts.attempts ?? 1);
        if (finalAttempt) {
            this.logger.error(`Verification email permanently failed (job ${job.id}): ${err.message}`);
             this.logger.error(`Job ${job.id} failed (attempts ${job.attemptsMade}): ${err.message}`)
            // send to Sentry / Slack, because this means mail delivery is broken
        }
       
    }
}