import { createHmac, randomInt, timingSafeEqual } from "crypto";

export function generateVerificationCode():string{
    return randomInt(0,1000_000)
            .toString()
            .padStart(6,'0');
}

export function hashVerificationCode(userId:string,
    challengeId:string,code:string,secret:string
):string {
    return createHmac('sha256', secret)
            .update(`${userId}: ${challengeId}:${code}`)
            .digest('hex')
}

export function matchesVerificationCode(
    candidateHash:string, 
    storedHash:string): boolean {
   const candidate = Buffer.from(candidateHash, 'hex')
   const stored = Buffer.from(storedHash, 'hex')

   return (
    candidate.length === stored.length && timingSafeEqual(candidate, stored)
   )
}