import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';


@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item, { name: 'createItem' })
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(
    @CurrentUser() user: User,
  ): Promise<Item[]> {
    return await this.itemsService.findAll(user);
  }

  @Query(() => Item, { name: 'item' })
  async findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string): Promise<Item> {
    return await this.itemsService.findOne(id);
  }

  @Mutation(() => Item, { name: 'updateItem' })
  async updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput): Promise<Item> {
    return await this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => Item, { name: 'removeItem' })
  async removeItem(
    @Args('id', { type: () => ID },ParseUUIDPipe) id: string
  ): Promise<Item> {
    return await this.itemsService.remove(id);
  }
}
