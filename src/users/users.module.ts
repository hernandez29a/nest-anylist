import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';
import { List } from 'src/lists/entities/list.entity';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports:[
    TypeOrmModule.forFeature([User]),
    ItemsModule,
    ListsModule
  ],
  exports: [
    TypeOrmModule,
    UsersService
  ], 
})
export class UsersModule {}
