import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { SlotsService } from './slots.service';
import { ReturnCount, Slot } from './entity/slot.entity';
import { FindManySlotArgs, FindUniqueSlotArgs } from './dtos/find.args';
import { CreateSlotInput } from './dtos/create-slot.input';
import { UpdateSlotInput } from './dtos/update-slot.input';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Booking } from 'src/models/bookings/graphql/entity/booking.entity';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';

@Resolver(() => Slot)
export class SlotsResolver {
  constructor(private readonly slotsService: SlotsService) {}

  @AllowAuthenticated()
  @Mutation(() => Slot)
  createSlot(
    @Args('createSlotInput') args: CreateSlotInput,
    @GetUser() user: GetUserType,
  ) {
    return this.slotsService.create(args);
  }

  @AllowAuthenticated('manager')
  @Mutation(() => ReturnCount)
  async createManySlots(
    @Args('createSlotInput') args: CreateSlotInput,
    @Args('count', {
      type: () => Number,
    })
    count: number,
    @GetUser() user: GetUserType,
  ) {
    return this.slotsService.createMany(args, user, count);
  }

  @Query(() => [Slot], { name: 'slots' })
  findAll(@Args() args: FindManySlotArgs) {
    return this.slotsService.findAll(args);
  }

  @Query(() => Slot, { name: 'slot' })
  findOne(@Args() args: FindUniqueSlotArgs) {
    return this.slotsService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Slot)
  async updateSlot(
    @Args('updateSlotInput') args: UpdateSlotInput,
    @GetUser() user: GetUserType,
  ) {
    return this.slotsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Slot)
  async removeSlot(
    @Args() args: FindUniqueSlotArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.slotsService.remove(args);
  }

  @ResolveField(() => Garage)
  async garage(@Parent() slot: Slot) {
    return this.slotsService.findGarageById(slot.garageId);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() slot: Slot) {
    return this.slotsService.findBookingsBySlotId(slot.id);
  }
}
