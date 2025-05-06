import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  
  @Field(() => Number, { nullable: true , description: 'Quantity of the item' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity: number = 0;

  @Field(() => Boolean, { nullable: true , description: 'If the item is completed' })
  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @Field(() => ID)
  @IsUUID()
  listId: string;

  @Field(() => String, { description: 'ID of the item' })
  @IsUUID()
  itemId: string;
}
