import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/browser/repository/Repository.js';

@Injectable()
export class MenuService {

  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>
  ) {}

  create(dto: CreateMenuDto) {
    return this.menuRepo.save(this.menuRepo.create(dto));
  }

  findAll() {
    return this.menuRepo.find();
  }

  findOne(id: string) {
    return this.menuRepo.findOne({ where: { id } });
  }

  update(id: string, dto: UpdateMenuDto) {
    return this.menuRepo.update(id, dto);
  }

  remove(id: string) {
    return this.menuRepo.delete(id);
  }
}
