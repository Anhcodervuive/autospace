import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BookingsService } from './bookings.service';
import { Booking } from './entity/booking.entity';
import { FindManyBookingArgs, FindUniqueBookingArgs } from './dtos/find.args';
import { CreateBookingInput } from './dtos/create-booking.input';
import { UpdateBookingInput } from './dtos/update-booking.input';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { BookingTimeline } from 'src/models/booking-timelines/graphql/entity/booking-timeline.entity';
import { Customer } from 'src/models/customers/graphql/entity/customer.entity';
import { Slot } from 'src/models/slots/graphql/entity/slot.entity';
import { ValetAssignment } from 'src/models/valet-assignments/graphql/entity/valet-assignment.entity';
import { AggregateCountOutput } from 'src/common/dtos/common.input';
import { BookingWhereInput } from './dtos/where.args';

@Resolver(() => Booking)
export class BookingsResolver {
  constructor(private readonly bookingsService: BookingsService) {}

  @AllowAuthenticated()
  @Mutation(() => Booking)
  createBooking(
    @Args('createBookingInput') args: CreateBookingInput,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.create(args);
  }

  @AllowAuthenticated('admin')
  @Query(() => [Booking], { name: 'bookings' })
  findAll(@Args() args: FindManyBookingArgs) {
    return this.bookingsService.findAll(args);
  }

  @AllowAuthenticated('manager')
  @Query(() => [Booking], { name: 'bookingsForGarage' })
  findAlBookingsForGarage(
    @Args() args: FindManyBookingArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.findAllBookingForGarages(args, user);
  }

  @AllowAuthenticated()
  @Query(() => [Booking], { name: 'bookingsForCustomer' })
  findAlBookingsForCustomer(
    @Args() args: FindManyBookingArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.findAll({
      ...args,
      where: { ...args.where, customerId: { equals: user.uid } },
    });
  }

  @AllowAuthenticated('valet')
  @Query(() => [Booking], { name: 'bookingsForValet' })
  async bookingsForValet(
    @Args() args: FindManyBookingArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.findAll({
      ...args,
      where: {
        ...args.where,
        Slot: {
          is: {
            Garage: {
              is: {
                Company: {
                  is: { Valets: { some: { uid: { equals: user.uid } } } },
                },
              },
            },
          },
        },
      },
    });
  }

  @Query(() => AggregateCountOutput)
  bookingsCount(
    @Args('where', { nullable: true })
    where: BookingWhereInput,
  ) {
    return this.bookingsService.getBookingCount(where);
  }

  @Query(() => Booking, { name: 'booking' })
  findOne(@Args() args: FindUniqueBookingArgs) {
    return this.bookingsService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Booking)
  async updateBooking(
    @Args('updateBookingInput') args: UpdateBookingInput,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Booking)
  async removeBooking(
    @Args() args: FindUniqueBookingArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingsService.remove(args);
  }

  @ResolveField(() => Slot)
  async slot(@Parent() booking: Booking) {
    return this.bookingsService.findSlotById(booking.slotId);
  }

  @ResolveField(() => Customer)
  async customer(@Parent() booking: Booking) {
    return this.bookingsService.findCustomerByUid(booking.customerId);
  }

  @ResolveField(() => ValetAssignment, { nullable: true })
  async valetAssignment(@Parent() booking: Booking) {
    return this.bookingsService.findValetAssignmentByBookingId(booking.id);
  }

  @ResolveField(() => [BookingTimeline], { nullable: true })
  async bookingTimeline(@Parent() booking: Booking) {
    return this.bookingsService.findTimelinesByBookingId(booking.id);
  }
}
