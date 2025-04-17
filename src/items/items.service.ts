import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Like, QueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';


@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository( Item)
    private readonly itemsRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {

    const newItem = this.itemsRepository.create({
      ...createItemInput,
      user, 
    });
    await this.itemsRepository.save(newItem);
    return newItem;
  }

  findAll(
    user: User, 
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
    ): Promise<Item[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

      const  QueryBuilder = this.itemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id })

      if(search ){
        QueryBuilder.andWhere('LOWER(name) ILIKE :name', { name: `%${search}%` })
      }


      return QueryBuilder.getMany();

    // return this.itemsRepository.find({
    //   take: limit,
    //   skip: offset,
    //   where: {
    //     user: {
    //       id: user.id,
    //     },
    //     ...(search && search.length > 2 && {
    //       name: Like(`%${search}%`),
    //     }),
    //   },
      
    // });

  }

  async findOne(id: string, user: User ): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });

    if(!item){
      throw new NotFoundException(`Item #${id} not found`);
    }

    return  item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {
    
    await this.findOne(id, user);
    
    const item = await this.itemsRepository.preload(updateItemInput);
    if(!item){
      throw new NotFoundException(`Item #${id} not found`);
    }

    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User ): Promise<Item> {
    //TODO hacer un borrado logico, integridad referencial
    const item = await this.findOne(id, user);
    await this.itemsRepository.remove(item);
    return{
      ...item,
      id
    }
  }

  async itemCountByUser(user: User): Promise<number> {
    return await this.itemsRepository.count({
      where: {
        user: {
          id: user.id,
        },
      }
    })
  }
}
