import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { CustomizationType } from "../entities/customization.entity";


export class CreateCustomizationDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;


    @IsEnum(CustomizationType)
    type: CustomizationType;
}
