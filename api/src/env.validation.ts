import {IsEnum, IsNumber, IsString, validateSync} from 'class-validator'
import {plainToInstance, Type} from 'class-transformer'

enum Environment{
    Development = "development",
    Production = "production",
    Test = "test",
    Provision = "provision"
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsString()
    JWT_SECRET: string;

  
    @IsNumber()
    PORT: number;

    @IsString()
    DB_HOST: string;


    @IsNumber()
    DB_PORT: number;

    @IsString()
    DB_USERNAME: string;

    @IsString()
    DB_PASSWORD: string;

    @IsString()
    DB_NAME: string;


    @IsString()
    MAIL_HOST: string;


    MAIL_PORT: number;

    @IsString()
    MAIL_USER: string;

    @IsString()
    MAIL_PASS: string;

    @IsString()
    SENDER_EMAIL: string;

    @IsString()
    ADMIN_EMAIL: string;


}
export function validate(config: Record<string, unknown>){
    const validatedConfig = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true
    })

    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    })

    if(errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig
}


