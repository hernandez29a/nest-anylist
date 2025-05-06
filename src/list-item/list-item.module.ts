import { forwardRef, Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { ListsModule } from 'src/lists/lists.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [
    TypeOrmModule.forFeature([ListItem]),
    ItemsModule,
    //forwardRef(() => ListsModule),
  ],
  exports: [
    ListItemService,
    TypeOrmModule,
  ],
})
export class ListItemModule {}
