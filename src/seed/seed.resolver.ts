import { Mutation, Resolver } from '@nestjs/graphql';
import { SeedService } from './seed.service';

@Resolver()
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, { name: 'executeSeed', description: 'Seed the database with initial data' })
  async executeSeed(): Promise<boolean> {
    //return true;
    return this.seedService.executeSeed();
  }
}
