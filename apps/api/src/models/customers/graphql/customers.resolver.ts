import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entity/customer.entity';
import { FindManyCustomerArgs, FindUniqueCustomerArgs } from './dtos/find.args';
import { CreateCustomerInput } from './dtos/create-customer.input';
import { UpdateCustomerInput } from './dtos/update-customer.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { User } from 'src/models/users/graphql/entity/user.entity';
import { Booking } from 'src/models/bookings/graphql/entity/booking.entity';
import { Review } from 'src/models/reviews/graphql/entity/review.entity';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @AllowAuthenticated()
  @Mutation(() => Customer)
  createCustomer(
    @Args('createCustomerInput') args: CreateCustomerInput,
    @GetUser() user: GetUserType,
  ) {
    checkRowLevelPermission({ user, requestedUid: args.uid });
    return this.customersService.create(args);
  }

  @Query(() => [Customer], { name: 'customers' })
  findAll(@Args() args: FindManyCustomerArgs) {
    return this.customersService.findAll(args);
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args() args: FindUniqueCustomerArgs) {
    return this.customersService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Customer)
  async updateCustomer(
    @Args('updateCustomerInput') args: UpdateCustomerInput,
    @GetUser() user: GetUserType,
  ) {
    const customer = await this.customersService.findOne({
      where: { uid: args.uid },
    });
    checkRowLevelPermission({ user, requestedUid: customer.uid });
    return this.customersService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Customer)
  async removeCustomer(
    @Args() args: FindUniqueCustomerArgs,
    @GetUser() user: GetUserType,
  ) {
    const customer = await this.customersService.findOne(args);
    checkRowLevelPermission({ user, requestedUid: customer.uid });
    return this.customersService.remove(args);
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() customer: Customer) {
    return this.customersService.findUserByUid(customer.uid);
  }

  @ResolveField(() => [Booking], { nullable: true })
  async bookings(@Parent() customer: Customer) {
    return this.customersService.findBookingsByCustomerUid(customer.uid);
  }

  @ResolveField(() => [Review], { nullable: true })
  async reviews(@Parent() customer: Customer) {
    return this.customersService.findReviewsByCustomerUid(customer.uid);
  }
}
