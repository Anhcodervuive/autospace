import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { Admin } from './entity/admin.entity';
import { FindManyAdminArgs, FindUniqueAdminArgs } from './dtos/find.args';
import { CreateAdminInput } from './dtos/create-admin.input';
import { UpdateAdminInput } from './dtos/update-admin.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Verification } from 'src/models/verifications/graphql/entity/verification.entity';
import { User } from 'src/models/users/graphql/entity/user.entity';

@Resolver(() => Admin)
export class AdminsResolver {
  constructor(private readonly adminsService: AdminsService) {}

  @AllowAuthenticated()
  @Mutation(() => Admin)
  createAdmin(
    @Args('createAdminInput') args: CreateAdminInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission({ user, requestedUid: args.uid });
    return this.adminsService.create(args);
  }

  @Query(() => [Admin], { name: 'admins' })
  findAll(@Args() args: FindManyAdminArgs) {
    return this.adminsService.findAll(args);
  }

  @Query(() => Admin, { name: 'admin' })
  findOne(@Args() args: FindUniqueAdminArgs) {
    return this.adminsService.findOne(args);
  }

  @AllowAuthenticated()
  @Query(() => Admin, { name: 'adminMe' })
  adminMe(@GetUser() user: GetUserType) {
    return this.adminsService.findOne({
      where: {
        uid: user.uid,
      },
    });
  }

  @AllowAuthenticated()
  @Mutation(() => Admin)
  async updateAdmin(
    @Args('updateAdminInput') args: UpdateAdminInput,
    @GetUser() user: GetUserType,
  ) {
    const admin = await this.adminsService.findOne({
      where: { uid: args.uid },
    });
    checkRowLevelPermission({ user, requestedUid: admin.uid });
    return this.adminsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Admin)
  async removeAdmin(
    @Args() args: FindUniqueAdminArgs,
    @GetUser() user: GetUserType,
  ) {
    const admin = await this.adminsService.findOne(args);
    checkRowLevelPermission({ user, requestedUid: admin.uid });
    return this.adminsService.remove(args);
  }

  @ResolveField(() => [Verification], { nullable: true })
  async verification(@Parent() admin: Admin) {
    return this.adminsService.findVerificationsByAdminUid(admin.uid);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() admin: Admin) {
    return this.adminsService.findUserByUid(admin.uid);
  }
}
