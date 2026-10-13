import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8, {message: 'Password must be at least 8 character'})
    @Matches(/(?=.*[A-Z])/, {message: 'Password must contain at least one uppercase'})
    @Matches(/(?=.*[a-z])/, {message: "Password must be at least one lowercase letter"})
    @Matches(/(?=.*\d)/, {message: 'Password must contain at least one number'})
    @Matches(/(?=.*[@$!%*?&])/, {message: 'Password must contain at least a special character'})
    password: string
}
