import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString, Min } from 'class-validator';

@InputType()
export class CreateItemInput {
  //@Field(() => Int, { description: 'Example field (placeholder)' })
  //exampleField: number;
  
  @Field( () => String )
  @IsNotEmpty()
  @IsString()
  name: string;

  // @Field( () => Float )
  // @IsPositive()
  // quantity: number;

  @Field( () => String, { nullable: true } )
  @IsString()
  @IsOptional()
  quantityUnits?: string;

}
