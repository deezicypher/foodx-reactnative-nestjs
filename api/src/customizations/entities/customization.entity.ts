import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "../../menu/entities/menu.entity";

export enum CustomizationType {
    topping = 'topping',
    side = 'side',
    size = 'size',
    crust = 'crust',
    bread = 'bread',
    spice = 'spice',
    base = 'base',
    sauce = 'sauce',
}

@Entity('customizations')   
export class Customization {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({type: "decimal", precision: 3, scale: 2})
    price: number;

    @Column({type: "enum", enum: CustomizationType})
    type: CustomizationType;

    @ManyToMany(() => Menu, menu => menu.customization)
    menu: Menu[];
}

