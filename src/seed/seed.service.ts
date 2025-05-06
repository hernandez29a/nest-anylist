import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';

import { Repository } from 'typeorm';

import { SEED_ITEMS, SEED_LISTS, SEED_USERS } from './data/seed-data';

import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from '../lists/lists.service';
import { ListItemService } from '../list-item/list-item.service';


@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        @InjectRepository(ListItem)
        private readonly listItemRepository: Repository<ListItem>,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,

        private readonly userService: UsersService,
        private readonly itemService: ItemsService,
        private readonly listService: ListsService,
        private readonly listItemService: ListItemService

    ) {
        this.isProd = configService.get('STATE') === 'prod';
    }

    async executeSeed(): Promise<boolean> {
        if(this.isProd){
            throw new BadRequestException('No se puede ejecutar el seed en produccion');
        }
        
        // Limpiar la base de datos Borrar todas las tablas
        await this.deleteDatabase();
        
        // Crear usuarios
       const user = await this.loadUsers();


        // Crear Items
        await this.loadItems(user);

        // Crear listas
        const list = await this.loadList(user);

        // Crear list items
        const items = await this.itemService.findAll(user, { limit: 15, offset: 0 }, {});
        await this.loadListItems(list, items);
        return true;
    }

    async deleteDatabase() {
        
        // borrar list items
        await this.listItemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar listas
        await this.listRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar items 
        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

        // borrar usuarios
        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();

    }

    async loadUsers(): Promise<User> {
        const users = []

        for ( const user of SEED_USERS){
            users.push( await this.userService.create(user) );
        }

        return users[0];
    }

    async loadItems(user: User): Promise<void> {
        const itemsPromises = []

        for ( const item of SEED_ITEMS){
            itemsPromises.push( this.itemService.create(item, user) );
        }

        await Promise.all(itemsPromises);

    }

    async loadList(user: User): Promise<List> {
        const lists = []

        for ( const list of SEED_LISTS){
            lists.push( await this.listService.create(list, user) );
        }

        return lists[0];
    }

    async loadListItems(list: List, items: Item[]) {
        for ( const item of items){
            await this.listItemService.create({
                listId: list.id,
                itemId: item.id,
                quantity: Math.round(Math.random() * 10),
                completed: Math.round(Math.random()) === 0 ? false : true,
            });
        }


    }
}
