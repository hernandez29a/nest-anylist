import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthResponse } from './types/auth-response.type';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enums';

@Resolver( () => AuthResponse)
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  //? Se recomienda usar esto en un restFull normal y no en GraphQL
  @Mutation( () => AuthResponse, {name: 'signup'})
  async signup(
    @Args('signupInput') signupInput: SignupInput): Promise<AuthResponse>{

    return await this.authService.signup(signupInput)
  }

  //? Se recomienda usar esto en un restFull normal y no en GraphQL
  @Mutation( () => AuthResponse , {name: 'login'})
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return await this.authService.login(loginInput)
  }

  @Query( () => AuthResponse  , {name: 'revalite'})
  @UseGuards(JwtAuthGuard )
  async revalidate(
    @CurrentUser( [ ValidRoles.admin ]) user: User
  ): Promise<AuthResponse> {
    return this.authService.revalidateToken(user);
  }

}
