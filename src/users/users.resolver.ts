import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { ItemsService } from 'src/items/items.service';

import { User } from './entities/user.entity';
import { Item } from 'src/items/entities/item.entity';

//import { CreateUserInput } from './dto/create-user.input';

import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.args';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';
import { List } from 'src/lists/entities/list.entity';
import { ListsService } from 'src/lists/lists.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
  ): Promise<User[]> {
    //console.log(validRoles);

    return this.usersService.findAll( validRoles.roles );
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) user: User,
  ): Promise<User> {
    return this.usersService.findOneById(id);
    //throw new Error('Method not implemented.');
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
  ): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput, adminUser);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
  ): Promise<User> {
    return this.usersService.blockUser(id, adminUser);
  }

  @ResolveField( () => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
    @Parent() user: User,
  ): Promise<Number> {
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField( () => Int, { name: 'listCount' })
  async listCount(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
    @Parent() user: User,
  ): Promise<Number> {
    return this.listsService.listCountByUser(user);
  }

  @ResolveField( () => [Item], { name: 'items' })
  async getAllItems(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<Item[]> {
    return await this.itemsService.findAll(user, paginationArgs, searchArgs);
  }

  @ResolveField( () => [Item], { name: 'lists' })
  async getAllList(
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser ]) adminUser: User,
    @Parent() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return await this.listsService.findAll(user, paginationArgs, searchArgs);
  }
  
}
