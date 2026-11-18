import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    return this.categoryRepo.save(this.categoryRepo.create(createCategoryDto));
  }

  findAll() {
    return this.categoryRepo.find();
  }

  findOne(id: string) {
    return this.categoryRepo.findOne({ where: { id } });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepo.update(id, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryRepo.delete(id);
  }
}
