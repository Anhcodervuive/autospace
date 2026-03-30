import { Module } from '@nestjs/common';
import { UsersService } from './graphql/users.service';
import { UsersResolver } from './graphql/users.resolver';
import { UsersController } from './rest/users.controller';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
