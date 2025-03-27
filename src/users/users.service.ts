import { Injectable } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  create(createUserInput: CreateUserInput) {
    return 'This action adds a new user';
  }

  async findAll():Promise<User[]> {
    return [];
    //return `This action returns all users`;
  }

  findOne(id: string): Promise<User> {
    throw new Error('Method not implemented.');
    //return `This action returns a #${id} user`;
  }

  /* update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    return `This action updates a #${id} user`;
  } */

    blockUser(id: string): Promise<User> {
      throw new Error('Method not implemented.');
    //return `This action removes a #${id} user`;
  }
}
