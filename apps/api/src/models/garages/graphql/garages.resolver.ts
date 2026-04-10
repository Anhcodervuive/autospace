import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { GaragesService } from './garages.service';
import { Garage } from './entity/garage.entity';
import { FindManyGarageArgs, FindUniqueGarageArgs } from './dtos/find.args';
import { CreateGarageInput } from './dtos/create-garage.input';
import { UpdateGarageInput } from './dtos/update-garage.input';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Address } from 'src/models/addresses/graphql/entity/address.entity';
import { Company } from 'src/models/companies/graphql/entity/company.entity';
import { Review } from 'src/models/reviews/graphql/entity/review.entity';
import { Slot } from 'src/models/slots/graphql/entity/slot.entity';
import { Verification } from 'src/models/verifications/graphql/entity/verification.entity';
import {
  DateFilterInput,
  GarageFilter,
  MinimalSlotGroupBy,
} from './dtos/search-filter.input';
import { LocationFilterInput } from 'src/common/dtos/common.input';
import { SlotWhereInput } from 'src/models/slots/graphql/dtos/where.args';

@Resolver(() => Garage)
export class GaragesResolver {
  constructor(private readonly garagesService: GaragesService) {}

  @AllowAuthenticated()
  @Mutation(() => Garage)
  createGarage(
    @Args('createGarageInput') args: CreateGarageInput,
    @GetUser() user: GetUserType,
  ) {
    return this.garagesService.create(args);
  }

  @Query(() => [Garage], { name: 'garages' })
  findAll(@Args() args: FindManyGarageArgs) {
    return this.garagesService.findAll(args);
  }

  @Query(() => Garage, { name: 'garage' })
  findOne(@Args() args: FindUniqueGarageArgs) {
    return this.garagesService.findOne(args);
  }

  @Query(() => [Garage], { name: 'searchGarages' })
  searchGarages(
    @Args('slotsFilter', { nullable: true }) filter: SlotWhereInput,
    @Args('dateFilter') dateFilter: DateFilterInput,
    @Args('locationFilter')
    locationFilter: LocationFilterInput,
    @Args('garageFilter', { nullable: true }) garageFilter: GarageFilter,
  ) {
    return this.garagesService.searchGarages(
      filter,
      dateFilter,
      locationFilter,
      garageFilter,
    );
  }

  @ResolveField(() => [MinimalSlotGroupBy], { name: 'availableSlots' })
  availableSlots(
    @Parent() garage: Garage,
    @Args('dateFilter') dateFilter: DateFilterInput,
    @Args('slotsFilter') slotsFilter: SlotWhereInput,
  ) {
    return this.garagesService.getAvailableSlots(
      garage,
      dateFilter,
      slotsFilter,
    );
  }

  @AllowAuthenticated()
  @Mutation(() => Garage)
  updateGarage(
    @Args('updateGarageInput') args: UpdateGarageInput,
    @GetUser() user: GetUserType,
  ) {
    return this.garagesService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Garage)
  async removeGarage(
    @Args() args: FindUniqueGarageArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.garagesService.remove(args);
  }

  @ResolveField(() => Company)
  async company(@Parent() garage: Garage) {
    return this.garagesService.findCompanyById(garage.companyId);
  }

  @ResolveField(() => Address, { nullable: true })
  async address(@Parent() garage: Garage) {
    return this.garagesService.findAddressByGarageId(garage.id);
  }

  @ResolveField(() => Verification, { nullable: true })
  async verification(@Parent() garage: Garage) {
    return this.garagesService.findVerificationByGarageId(garage.id);
  }

  @ResolveField(() => [Review], { nullable: true })
  async reviews(@Parent() garage: Garage) {
    return this.garagesService.findReviewsByGarageId(garage.id);
  }

  @ResolveField(() => [Slot], { nullable: true })
  async slots(@Parent() garage: Garage) {
    return this.garagesService.findSlotsByGarageId(garage.id);
  }
}
