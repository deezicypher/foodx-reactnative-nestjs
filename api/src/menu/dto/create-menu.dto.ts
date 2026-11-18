import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreateMenuDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    image_url: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    @Max(5)
    rating: number;

    @IsNotEmpty()
    @IsNumber()
    @Max(10000)
    @Min(0)
    calories: number;

    @IsNotEmpty()
    @IsNumber()
    @Max(1000)
    @Min(0)
    protein: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    price: number;
}
