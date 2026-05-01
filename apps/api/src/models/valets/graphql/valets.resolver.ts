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
import { ValetWhereInput } from './dtos/where.args';
import { Booking } from 'src/models/bookings/graphql/entity/booking.entity';
import { PaginationInput } from 'src/common/dtos/common.input';
import { $Enums, BookingStatus } from '@prisma/client';

@Resolver(() => Valet)
export class ValetsResolver {
  constructor(private readonly valetsService: ValetsService) {}

  @AllowAuthenticated()
  @Mutation(() => Valet)
  createValet(
    @Args('createValetInput') args: CreateValetInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.create(args, user);
  }

  @AllowAuthenticated('admin')
  @Query(() => [Valet], { name: 'valets' })
  findAll(@Args() args: FindManyValetArgs) {
    return this.valetsService.findAll(args);
  }

  @AllowAuthenticated('manager')
  @Query(() => [Valet], { name: 'companyValets' })
  findAllCompanyValets(
    @Args() args: FindManyValetArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.findAll({
      ...args,
      where: {
        Company: {
          is: {
            Managers: {
              some: {
                uid: {
                  equals: user.uid,
                },
              },
            },
          },
        },
      },
    });
  }

  @AllowAuthenticated('manager')
  @Query(() => Number)
  companyValetsTotal(
    @Args('where', { nullable: true }) args: ValetWhereInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.getCompanyValetsTotal(args, user);
  }

  @Query(() => Valet, { name: 'valet' })
  findOne(@Args() args: FindUniqueValetArgs) {
    return this.valetsService.findOne(args);
  }

  @AllowAuthenticated()
  @Query(() => Valet, { name: 'valetMe' })
  valetMe(@GetUser() user: GetUserType) {
    return this.valetsService.findOne({
      where: {
        uid: user.uid,
      },
    });
  }

  @AllowAuthenticated('valet')
  @Query(() => [Booking], { name: 'valetPickups' })
  valetPickups(
    @Args() pagination: PaginationInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.valetPickups(pagination, user);
  }

  @AllowAuthenticated()
  @Query(() => Number)
  valetPickupsTotal(@GetUser() user: GetUserType) {
    return this.valetsService.getValetPickupsTotal(user);
  }

  @AllowAuthenticated('valet')
  @Query(() => [Booking], { name: 'valetDrops' })
  valetDrops(
    @Args() pagination: PaginationInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.valetDrops(pagination, user);
  }
  @AllowAuthenticated()
  @Query(() => Number)
  valetDropsTotal(@GetUser() user: GetUserType) {
    return this.valetsService.getValetDropsTotal(user);
  }

  @AllowAuthenticated()
  @Mutation(() => Booking)
  assignValet(
    @Args('bookingId') bookingId: number,
    @Args('status') status: $Enums.BookingStatus,
    @GetUser() user: GetUserType,
  ) {
    return this.valetsService.assignValet(bookingId, status, user);
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
