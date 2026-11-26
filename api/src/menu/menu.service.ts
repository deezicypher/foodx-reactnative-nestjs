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

  async search(query?:string, category?:string, limit?:number){

    const categoryId = category?.trim();
    const normalizedQuery = query?.trim().toLowerCase();

    const queryBuilder = this.menuRepo
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.category', 'category')
      .leftJoinAndSelect('menu.customization', 'customization')
      .orderBy('menu.createdAt', 'DESC')

    if(normalizedQuery && !['undefined', 'null'].includes(normalizedQuery)){
      queryBuilder.andWhere('menu.name ILIKE :query', 
        {query: `%${normalizedQuery}%`})
    }

    if(categoryId && !['undefined','null'].includes(categoryId.toLowerCase())){
      queryBuilder.andWhere('category.id = :categoryId', { categoryId })
    }

    if(limit !== undefined && Number.isFinite(limit) && limit > 0){
      queryBuilder.take(Math.floor(limit))
    }

    return queryBuilder.getMany()
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
