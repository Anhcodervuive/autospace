import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ValetsService } from './valets.service';
import { Valet } from './entity/valet.entity';
import { FindManyValetArgs, FindUniqueValetArgs } from './dtos/find.args';
import { CreateValetInput } from './dtos/create-valet.input';
import { UpdateValetInput } from './dtos/update-valet.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { BookingTimeline } from 'src/models/booking-timelines/graphql/entity/booking-timeline.entity';
import { Company } from 'src/models/companies/graphql/entity/company.entity';
import { User } from 'src/models/users/graphql/entity/user.entity';
import { ValetAssignment } from 'src/models/valet-assignments/graphql/entity/valet-assignment.entity';

@Resolver(() => Valet)
export class ValetsResolver {
  constructor(private readonly valetsService: ValetsService) {}

  @AllowAuthenticated()
  @Mutation(() => Valet)
  createValet(
    @Args('createValetInput') args: CreateValetInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission({ user, requestedUid: args.uid });
    return this.valetsService.create(args);
  }

  @Query(() => [Valet], { name: 'valets' })
  findAll(@Args() args: FindManyValetArgs) {
    return this.valetsService.findAll(args);
  }

  @Query(() => Valet, { name: 'valet' })
  findOne(@Args() args: FindUniqueValetArgs) {
    return this.valetsService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Valet)
  async updateValet(
    @Args('updateValetInput') args: UpdateValetInput,
    @GetUser() user: GetUserType,
  ) {
    const valet = await this.valetsService.findOne({
      where: { uid: args.uid },
    });
    checkRowLevelPermission({ user, requestedUid: valet.uid });
    return this.valetsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Valet)
  async removeValet(
    @Args() args: FindUniqueValetArgs,
    @GetUser() user: GetUserType,
  ) {
    const valet = await this.valetsService.findOne(args);
    checkRowLevelPermission({ user, requestedUid: valet.uid });
    return this.valetsService.remove(args);
  }

  @ResolveField(() => User)
  async user(@Parent() valet: Valet) {
    return this.valetsService.findUserByUid(valet.uid);
  }

  @ResolveField(() => Company, { nullable: true })
  async company(@Parent() valet: Valet) {
    if (valet.companyId == null) {
      return null;
    }
    return this.valetsService.findCompanyById(valet.companyId);
  }

  @ResolveField(() => [BookingTimeline], { nullable: true })
  async bookingTimeline(@Parent() valet: Valet) {
    return this.valetsService.findBookingTimelinesByValetUid(valet.uid);
  }

  @ResolveField(() => [ValetAssignment], { nullable: true })
  async pickupAssignments(@Parent() valet: Valet) {
    return this.valetsService.findPickupAssignmentsByValetUid(valet.uid);
  }

  @ResolveField(() => [ValetAssignment], { nullable: true })
  async returnAssignments(@Parent() valet: Valet) {
    return this.valetsService.findReturnAssignmentsByValetUid(valet.uid);
  }
}
