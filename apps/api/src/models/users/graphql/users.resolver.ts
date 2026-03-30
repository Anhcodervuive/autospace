import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entity/user.entity';
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args';
import { CreateUserInput } from './dtos/create-user.input';
import { UpdateUserInput } from './dtos/update-user.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  // @AllowAuthenticated()
  @Mutation(() => User)
  createUser(
    @Args('createUserInput') args: CreateUserInput,
    // @GetUser() authUser: GetUserType,
  ) {
    // checkRowLevelPermission(authUser, args.uid);
    return this.usersService.create(args);
  }

  @Query(() => [User], { name: 'users' })
  findAll(@Args() args: FindManyUserArgs) {
    return this.usersService.findAll(args);
  }

  @Query(() => User, { name: 'user', nullable: true })
  findOne(@Args() args: FindUniqueUserArgs) {
    return this.usersService.findOne(args.where.uid);
  }

  @AllowAuthenticated()
  @Mutation(() => User)
  async updateUser(
    @Args('updateUserInput') args: UpdateUserInput,
    @GetUser() authUser: GetUserType,
  ) {
    const targetUser = await this.prisma.user.findUnique({
      where: { uid: args.uid },
    });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission(authUser, targetUser.uid);
    return this.usersService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => User)
  async removeUser(
    @Args() args: FindUniqueUserArgs,
    @GetUser() authUser: GetUserType,
  ) {
    const targetUser = await this.usersService.findOne(args.where.uid);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission(authUser, targetUser.uid);
    return this.usersService.remove(args.where.uid);
  }
}
