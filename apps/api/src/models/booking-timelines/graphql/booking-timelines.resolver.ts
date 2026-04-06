import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BookingTimelinesService } from './booking-timelines.service';
import { BookingTimeline } from './entity/booking-timeline.entity';
import {
  FindManyBookingTimelineArgs,
  FindUniqueBookingTimelineArgs,
} from './dtos/find.args';
import { CreateBookingTimelineInput } from './dtos/create-booking-timeline.input';
import { UpdateBookingTimelineInput } from './dtos/update-booking-timeline.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Booking } from 'src/models/bookings/graphql/entity/booking.entity';
import { Manager } from 'src/models/managers/graphql/entity/manager.entity';
import { Valet } from 'src/models/valets/graphql/entity/valet.entity';

@Resolver(() => BookingTimeline)
export class BookingTimelinesResolver {
  constructor(
    private readonly bookingTimelinesService: BookingTimelinesService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated()
  @Mutation(() => BookingTimeline)
  createBookingTimeline(
    @Args('createBookingTimelineInput') args: CreateBookingTimelineInput,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingTimelinesService.create(args);
  }

  @Query(() => [BookingTimeline], { name: 'bookingTimelines' })
  findAll(@Args() args: FindManyBookingTimelineArgs) {
    return this.bookingTimelinesService.findAll(args);
  }

  @Query(() => BookingTimeline, { name: 'bookingTimeline' })
  findOne(@Args() args: FindUniqueBookingTimelineArgs) {
    return this.bookingTimelinesService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => BookingTimeline)
  async updateBookingTimeline(
    @Args('updateBookingTimelineInput') args: UpdateBookingTimelineInput,
    @GetUser() user: GetUserType,
  ) {
    const bookingTimeline = await this.prisma.bookingTimeline.findUnique({
      where: { id: args.id },
    });
    return this.bookingTimelinesService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => BookingTimeline)
  async removeBookingTimeline(
    @Args() args: FindUniqueBookingTimelineArgs,
    @GetUser() user: GetUserType,
  ) {
    const bookingTimeline = await this.prisma.bookingTimeline.findUnique(args);
    return this.bookingTimelinesService.remove(args);
  }

  @ResolveField(() => Booking)
  async booking(@Parent() bookingTimeline: BookingTimeline) {
    return this.prisma.booking.findUnique({
      where: { id: bookingTimeline.bookingId },
    });
  }

  @ResolveField(() => Valet, { nullable: true })
  async valet(@Parent() bookingTimeline: BookingTimeline) {
    if (!bookingTimeline.valetId) {
      return null;
    }
    return this.prisma.valet.findUnique({
      where: { uid: bookingTimeline.valetId },
    });
  }

  @ResolveField(() => Manager, { nullable: true })
  async manager(@Parent() bookingTimeline: BookingTimeline) {
    if (!bookingTimeline.managerId) {
      return null;
    }
    return this.prisma.manager.findUnique({
      where: { uid: bookingTimeline.managerId },
    });
  }
}
