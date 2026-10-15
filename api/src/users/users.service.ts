import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'bcryptjs'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>
  ){}

  async create(dto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(dto.email)
    if(existingUser?.isEmailVerified) throw new ConflictException("User with this email already exists")
    try{
    const pass = await bcrypt.hash(dto.password, 12)
    const user = existingUser?this.userRepo.save({...existingUser, 
      name:dto.name, password:pass}):this.userRepo.save(
        this.userRepo.create({...dto,password:pass})
      )
    return user
    }catch(err){
      console.log(err)
      if ((err as { code?: string }).code === '23505') { // Postgres unique violation
        throw new ConflictException('Please try again');
      }
      throw new InternalServerErrorException('Unable to proceed further at the moment')
    }
  }

  findAll() {
    return this.userRepo.find({order:{createdAt:"DESC"}});
  }

  findOne(id: string) {
    return this.userRepo.findOneBy({id});
  }
  
  findOneByEmail(email: string) : Promise<User | null> {
    return this.userRepo.findOneBy({email});
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
