import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Customization } from '../../customizations/entities/customization.entity';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  image_url: string;

  @Column({ type: 'double precision', scale: 2, precision: 3 })
  rating: number;

  @Column()
  calories: number;

  @Column()
  protein: number;

  @Column({ type: 'decimal' })
  price: number;

  @ManyToOne(() => Category, (category) => category.menu, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category;

  @ManyToMany(() => Customization, (customization) => customization.menu)
  @JoinTable({
    name: 'menu_customizations',
    joinColumn: { name: 'menuId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'customizationId', referencedColumnName: 'id' },
  })
  customization: Customization[];
}
