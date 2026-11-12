import { IsByteLength, IsEmail, IsString, Matches } from 'class-validator';

export class ResetPasswordDTO {
  @IsEmail()
  email: string;

  @Matches(/^\d{6}$/)
  code: string;

  @IsString()
  @IsByteLength(8, 72)
  newPassword: string;
}
