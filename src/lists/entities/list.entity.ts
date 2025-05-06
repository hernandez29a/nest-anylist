import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'lists' })
@ObjectType()
export class List {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID, { description: 'ID of the list' })
  id: string;

  @Column()
  @Field(() => String, { description: 'Name of the list' })
  name: string;

  //* relacion with the user who created the list
  @ManyToOne(() => User, (user) => user.list, {nullable: false, lazy: true})
  @Index('userId-list-index')
  @Field(() => User, { description: 'User who created the list' })
  user: User;

  @OneToMany(() => ListItem, (listItem) => listItem.list, {nullable: false, lazy: true})
  //@Field(() => [ListItem], { description: 'Items in the list' })
  listItem: ListItem[];

}
