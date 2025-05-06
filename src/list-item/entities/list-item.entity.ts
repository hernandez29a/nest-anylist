import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';

@Entity({ name: 'listItems' })
@ObjectType()
export class ListItem {
   @PrimaryGeneratedColumn('uuid')
    @Field(() => ID, { description: 'ID of the list' })
    id: string;

    @Column({ type: 'int' })
    @Field(() => Number, { description: 'Quantity of the item' })
    quantity: number;

    @Column({ type: 'boolean'})
    @Field(() => Boolean, { description: 'If the item is completed' })
    completed: boolean

    //@Unique('listItem-item', ['list','item'])
    @ManyToOne(() => List, (list) => list.listItem, { lazy: true})
    @Field(() => List, { description: 'List associated with the list item' })
    list: List

    @ManyToOne(() => Item, (item) => item.listItem, { lazy: true})
    @Field(() => Item, { description: 'Item associated with the list item' })
    item: Item
}
