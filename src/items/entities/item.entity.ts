import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, Index, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'items'})
@ObjectType()
export class Item {
  //@Field(() => Int, { description: 'Example field (placeholder)' })
  //exampleField: number;

  @PrimaryGeneratedColumn('uuid')
  @Field( () => ID )
  id:string;

  @Column()
  @Field( () => String )
  name: string;

  // @Column()
  // @Field( () => Float )
  // quantity: number;

  @Column({nullable: true})
  @Field( () => String, {nullable: true})
  quantityUnits?: string;

  // stor
  // //user
  @ManyToOne(() => User, (user) => user.items, {nullable: false, lazy: true})
  @Index('userId-index')
  @Field(() => User, {nullable: true})
  user: User;


}
