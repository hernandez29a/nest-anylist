import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

  ) {}

  async create(signupInput: SignupInput): Promise<User> {

    try {

      const user = this.usersRepository.create(signupInput);
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      //console.log(error);
      this.handleBDError(error);
      //throw new BadRequestException('Error creating user');
    }
    
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

  private readonly handleBDError = (error: any): never => {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Pleasse check server logs');
  }
}
