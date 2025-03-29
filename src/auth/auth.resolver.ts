import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Mutation( () => AuthResponse, {name: 'signup'})
  async signup(
    @Args('signupInput') signupInput: SignupInput): Promise<AuthResponse>{

    return await this.authService.signup(signupInput)
  }

  @Mutation( () => AuthResponse , {name: 'login'})
  async login(
    @Args('loginInput') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return await this.authService.login(loginInput)
  }

/*   @Query(, {name: 'revalidate'})
  async revalidate(){
    return await this.authService.revalidateToken()
  } */

}
