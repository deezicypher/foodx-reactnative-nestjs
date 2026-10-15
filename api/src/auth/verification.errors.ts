import { HttpException, HttpStatus } from "@nestjs/common";

export class ResendCooldownException extends HttpException {
  constructor(retryAfterSeconds?: number) {
    super(
      {
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: 'Please wait before requesting another code',
        retryAfterSeconds,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}