import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, UpdateItemInput } from './dto/inputs';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';


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

  findAll(user: User): Promise<Item[]> {
    
    // TODO filtrar , paginar por usuario
    return this.itemsRepository.find({
      where: {
        user: {
          id: user.id,
        },
      },
      
    });

  }

  async findOne(id: string): Promise<Item> {

    const item = await this.itemsRepository.findOneBy({id});

    if(!item){
      throw new NotFoundException(`Item #${id} not found`);
    }

    return  item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    
    const item = await this.itemsRepository.preload(updateItemInput);
    if(!item){
      throw new NotFoundException(`Item #${id} not found`);
    }

    return await this.itemsRepository.save(item);
  }

  async remove(id: string): Promise<Item> {
    //TODO hacer un borrado logico, integridad referencial
    const item = await this.findOne(id)
    await this.itemsRepository.remove(item);
    return{
      ...item,
      id
    }
  }
}
