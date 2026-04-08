import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ManagersService } from './managers.service';
import { Manager } from './entity/manager.entity';
import { FindManyManagerArgs, FindUniqueManagerArgs } from './dtos/find.args';
import { CreateManagerInput } from './dtos/create-manager.input';
import { UpdateManagerInput } from './dtos/update-manager.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { User } from 'src/models/users/graphql/entity/user.entity';
import { Company } from 'src/models/companies/graphql/entity/company.entity';
import { BookingTimeline } from 'src/models/booking-timelines/graphql/entity/booking-timeline.entity';

@Resolver(() => Manager)
export class ManagersResolver {
  constructor(private readonly managersService: ManagersService) {}

  @AllowAuthenticated()
  @Mutation(() => Manager)
  createManager(
    @Args('createManagerInput') args: CreateManagerInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission({ user, requestedUid: args.uid });
    return this.managersService.create(args);
  }

  @Query(() => [Manager], { name: 'managers' })
  findAll(@Args() args: FindManyManagerArgs) {
    return this.managersService.findAll(args);
  }

  @Query(() => Manager, { name: 'manager' })
  findOne(@Args() args: FindUniqueManagerArgs) {
    return this.managersService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Manager)
  async updateManager(
    @Args('updateManagerInput') args: UpdateManagerInput,
    @GetUser() user: GetUserType,
  ) {
    const manager = await this.managersService.findOne({
      where: { uid: args.uid },
    });
    checkRowLevelPermission({ user, requestedUid: manager.uid });
    return this.managersService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Manager)
  async removeManager(
    @Args() args: FindUniqueManagerArgs,
    @GetUser() user: GetUserType,
  ) {
    const manager = await this.managersService.findOne(args);
    checkRowLevelPermission({ user, requestedUid: manager.uid });
    return this.managersService.remove(args);
  }

  @ResolveField(() => User)
  async user(@Parent() manager: Manager) {
    return this.managersService.findUserByUid(manager.uid);
  }

  @ResolveField(() => Company, { nullable: true })
  async company(@Parent() manager: Manager) {
    if (manager.companyId == null) {
      return null;
    }
    return this.managersService.findCompanyById(manager.companyId);
  }

  @ResolveField(() => [BookingTimeline], { nullable: true })
  async bookingTimeline(@Parent() manager: Manager) {
    return this.managersService.findBookingTimelinesByManagerUid(manager.uid);
  }
}
