import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomizationsService } from './customizations.service';
import { CreateCustomizationDto } from './dto/create-customization.dto';
import { UpdateCustomizationDto } from './dto/update-customization.dto';

@Controller('customizations')
export class CustomizationsController {
  constructor(private readonly customizationsService: CustomizationsService) {}

  @Post()
  create(@Body() dto: CreateCustomizationDto) {
    return this.customizationsService.create(dto);
  }

  @Get()
  findAll() {
    return this.customizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customizationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomizationDto) {
    return this.customizationsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customizationsService.remove(id);
  }
}
