import { Inject, Injectable } from '@nestjs/common';
import { CreateCustomizationDto } from './dto/create-customization.dto';
import { UpdateCustomizationDto } from './dto/update-customization.dto';
import { Customization } from './entities/customization.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomizationsService {
  constructor(
    @InjectRepository(Customization)
    private customizationRepo: Repository<Customization>
  ) {}

  create(dto: CreateCustomizationDto) {
    return this.customizationRepo.save(this.customizationRepo.create(dto));
  }

  findAll() {
    return this.customizationRepo.find();
  }

  findOne(id: string) {
    return this.customizationRepo.findOne({ where: { id } });
  }

  update(id: string, dto: UpdateCustomizationDto) {
    return this.customizationRepo.update(id, dto);
  }

  remove(id: string) {
    return this.customizationRepo.delete(id);
  }
}
