import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { ListItem } from './entities/list-item.entity';
import { Repository } from 'typeorm';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListItemService {

  constructor(
     @InjectRepository(ListItem)
      private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...rest } = createListItemInput;
    const listItem = this.listItemRepository.create({
      ...rest,
      item: { id: itemId },
      list: { id: listId },
    });
    await this.listItemRepository.save(listItem);
    return this.findOne(listItem.id);
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"listId" = :listId`, { listId: list.id });

      if(search){
        queryBuilder.andWhere('LOWER(name) ILIKE :name', { name: `%${search}%` });
      }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<ListItem> {
    const listItem = await this.listItemRepository.findOneBy({ id });
    if(!listItem) throw new NotFoundException(`List item with id ${id} not found`);
    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    const { itemId, listId, ...toUpdate } = updateListItemInput;
    const queryBuilder = this.listItemRepository.createQueryBuilder()
      .update()
      .set(toUpdate)
      .where("id = :id", { id });

      if(listId) queryBuilder.set({ list: { id: listId } });
      if(itemId) queryBuilder.set({ item: { id: itemId } });

    await queryBuilder.execute();
    return this.findOne(id);

  }

  remove(id: number) {
    return `This action removes a #${id} listItem`;
  }

  async countListItems(list: List): Promise<number> {
    return await this.listItemRepository.count({
      where: {
        list: {
          id: list.id,
        },
      }
    })
  }
}
