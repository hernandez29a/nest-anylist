import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService, // Assuming you have a UsersService to handle user-related operations
        private readonly jwtService: JwtService, // Assuming you have a JwtService to handle JWT operations
    ) {}

    private getJwtToken(userId: string) {
        return this.jwtService.sign({ id: userId });
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse> {

        const user = await this.usersService.create(signupInput);
        // Here you would typically hash the password and save the user to the database
        const token = this.getJwtToken(user.id);
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
        const token = this.getJwtToken(user.id);
        return {
            token,
            user
        }
    }

    async validateUser(id: string): Promise<User> {
        const user = await this.usersService.findOneById(id);
        if (!user.isactive) 
            throw new UnauthorizedException('User not active, talk with admin');
        delete user.password; // Remove password from the user object before returning it
        
        return user;
    }

    async revalidateToken(user: User): Promise<AuthResponse> {
        const token = this.getJwtToken(user.id);
        return {
            token,
            user
        }
    }


}
