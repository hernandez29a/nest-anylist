import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {

    private isProd: boolean;

    constructor(
        private readonly configService: ConfigService,
        
        @InjectRepository(User) 
        private readonly usersRepository: Repository<User>,

        @InjectRepository(Item)
        private readonly itemsRepository: Repository<Item>,

        private readonly userService: UsersService,
        private readonly itemService: ItemsService

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
        
        return true;
    }

    async deleteDatabase() {
        
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
}
