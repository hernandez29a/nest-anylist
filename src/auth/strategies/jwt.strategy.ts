import { Strategy, ExtractJwt } from 'passport-jwt'; // Cambiado a passport-jwt
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET'), // Obtiene la clave secreta desde ConfigService
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    //console.log('payload', payload);

    const {id} = payload;
    const user = await this.authService.validateUser(id);
    //console.log('user***', user);

    return user;
  }
}