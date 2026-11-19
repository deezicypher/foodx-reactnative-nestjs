import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomizationDto } from './create-customization.dto';

export class UpdateCustomizationDto extends PartialType(CreateCustomizationDto) {}
