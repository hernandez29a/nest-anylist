import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService, // Assuming you have a UsersService to handle user-related operations
    ) {}

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        const token = '123456'
        return{
            token,
            user
        }

    }

    async login(loginInput: LoginInput): Promise<AuthResponse> {
        const user = await this.usersService.findOneByEmail(loginInput.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        if(!bcrypt.compareSync(loginInput.password, user.password)){
            throw new BadRequestException('Invalid credentials');
        }

        // Here you would typically validate the password and generate a JWT token
        //TODO crear el token
        const token = '123456'
        return {
            token,
            user
        }
    }
}
