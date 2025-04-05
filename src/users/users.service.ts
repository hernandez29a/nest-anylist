import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/inputs/signup.input';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidRoles } from 'src/auth/enums/valid-roles.enums';

@Injectable()
export class UsersService {

  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

  ) {}

  async create(signupInput: SignupInput): Promise<User> {

    try {

      const user = this.usersRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
      //console.log(user);
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      //console.log(error);
      this.handleBDError(error);
      //throw new BadRequestException('Error creating user');
    }
    
  }

  async findAll(roles: ValidRoles[]):Promise<User[]> {

    if (roles.length === 0) return this.usersRepository.find({
      //TODO no es necesaria por que temenos el lazy declarado en el entity
      /* relations:{
        lastUpdateBy: true,
      } */
    });
    
    return this.usersRepository.createQueryBuilder()
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneByEmail(email: string): Promise<User> {
    try {

      return await this.usersRepository.findOneByOrFail({ email });

    } catch (error) {
      throw new BadRequestException(`${email} not found`);
      
      /* this.handleBDError({
        //code: '23505',
        detail: 'User not found'
      }); */
    }
    //return `This action returns a #${id} user`;
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new BadRequestException(`${id} not found`);
    }
  }

  async update(
    id: string, 
    updateUserInput: UpdateUserInput,
    adminUser: User
  ): Promise<User> {
    
    try {
      const user = await this.usersRepository.preload({
        ...updateUserInput,
        id
      });

      user.lastUpdateBy= adminUser
      return await this.usersRepository.save(user);
    } catch (error) {
      this.handleBDError(error);
    }


  }

    async blockUser(id: string, adminUser: User): Promise<User> {

      const userToBlock = await this.findOneById(id);
      userToBlock.isactive = false;
      userToBlock.lastUpdateBy = adminUser;

      await this.usersRepository.save(userToBlock);

      return userToBlock;
  }

  private readonly handleBDError = (error: any): never => {
    if (error.code === '23505') {
      throw new BadRequestException('User already exists');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Pleasse check server logs');
  }
}
