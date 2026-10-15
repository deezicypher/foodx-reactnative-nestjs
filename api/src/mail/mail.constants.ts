import { VerificationPurpose } from "../auth/entities/email-verification-challenge.entity";

export const MAIL_QUEUE = 'mail';
export const SEND_VERIFICATION_CODE = 'send-verification-code';

export interface VerificationMailJob {
  to: string;
  code: string;
  name:string;
  purpose: VerificationPurpose;
  challengeId: string;
}