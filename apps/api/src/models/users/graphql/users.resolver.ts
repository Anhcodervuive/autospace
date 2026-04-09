import {
  Resolver,
  ResolveField,
  Query,
  Mutation,
  Args,
  Parent,
} from '@nestjs/graphql';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthProvider, User } from './entity/user.entity';
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args';
import {
  LoginInput,
  LoginOutPut,
  RegisterUserWithCredentialInput,
  RegisterUserWithProviderInput,
} from './dtos/create-user.input';
import { UpdateUserInput } from './dtos/update-user.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Admin } from 'src/models/admins/graphql/entity/admin.entity';
import { Customer } from 'src/models/customers/graphql/entity/customer.entity';
import { Manager } from 'src/models/managers/graphql/entity/manager.entity';
import { Valet } from 'src/models/valets/graphql/entity/valet.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async registerWithCredentials(
    @Args('registerWithCredentialsInput')
    args: RegisterUserWithCredentialInput,
  ) {
    return this.usersService.registerWithCredentials(args);
  }

  @Mutation(() => User)
  registerWithProvider(
    @Args('registerWithProviderInput')
    args: RegisterUserWithProviderInput,
  ) {
    return this.usersService.registerWithProvider(args);
  }

  @Mutation(() => LoginOutPut)
  async login(@Args('loginInput') args: LoginInput) {
    return this.usersService.login(args);
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
    const targetUser = await this.usersService.findOne(args.uid);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
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

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
    return this.usersService.remove(args.where.uid);
  }

  @Query(() => AuthProvider, { name: 'getAuthProvider', nullable: true })
  getAuthProvider(@Args('uid') uid: string) {
    return this.usersService.getAuthProvider(uid);
  }

  @ResolveField(() => Admin, { nullable: true })
  async admin(@Parent() user: User) {
    return this.usersService.findAdminByUid(user.uid);
  }

  @ResolveField(() => Customer, { nullable: true })
  async customer(@Parent() user: User) {
    return this.usersService.findCustomerByUid(user.uid);
  }

  @ResolveField(() => Manager, { nullable: true })
  async manager(@Parent() user: User) {
    return this.usersService.findManagerByUid(user.uid);
  }

  @ResolveField(() => Valet, { nullable: true })
  async valet(@Parent() user: User) {
    return this.usersService.findValetByUid(user.uid);
  }
}
