import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { ListItemService } from 'src/list-item/list-item.service';

@Injectable()
export class ListsService {
  
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    //console.log(user);
    const newList = this.listRepository.create({...createListInput, user});
    await this.listRepository.save(newList);
    return newList;
  }

  async findAll(
    user: User, 
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) ILIKE :name', { name: `%${search}%` });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
          id,
          user: {
            id: user.id,
          },
        });
    
        if(!list){
          throw new NotFoundException(`List #${id} not found`);
        }
    
        return  list;
  }

   async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {
    await this.findOne(id, user);

    const list = await this.listRepository.preload({...updateListInput, user});

    if (!list) {
      throw new NotFoundException(`List #${id} not found`);
    }

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User ) {
    const list = await this.findOne(id, user);
    await this.listRepository.remove(list);
    return{
      ...list,
      id
    }
  }

  async listCountByUser(user: User): Promise<number> {
    return await this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      }
    })
  }


}
