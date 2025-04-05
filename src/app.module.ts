import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
//import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot(),
    
    //! Configuracion de GraphQL para obtener el login por medio de un resFul API
   /*  GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ AuthModule ],
      inject: [ JwtService],
      useFactory: async ( jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [
          ApolloServerPluginLandingPageLocalDefault(),
        ],
        context({req}){
          const token  = req.headers.authorization?.replace('Bearer ', '');
          if(!token) throw new Error('No token provided');

          const payload = jwtService.decode(token);
          if(!payload) throw new Error('Token not valid');          
        } 
        //debug: false,
        //includeStacktraceInErrorResponses: false,
      })
    }), */


    //* configuracion basica de graphql
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      includeStacktraceInErrorResponses:false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
      ],
      autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
      }),



      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_host,
        port: +process.env.DB_PORT,
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        synchronize: true,
        autoLoadEntities: true,
      }),
    ItemsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
