import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entity/review.entity';
import { FindManyReviewArgs, FindUniqueReviewArgs } from './dtos/find.args';
import { CreateReviewInput } from './dtos/create-review.input';
import { UpdateReviewInput } from './dtos/update-review.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Customer } from 'src/models/customers/graphql/entity/customer.entity';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @AllowAuthenticated()
  @Mutation(() => Review)
  createReview(
    @Args('createReviewInput') args: CreateReviewInput,
    @GetUser() user: GetUserType,
  ) {
    return this.reviewsService.create(args);
  }

  @Query(() => [Review], { name: 'reviews' })
  findAll(@Args() args: FindManyReviewArgs) {
    return this.reviewsService.findAll(args);
  }

  @Query(() => Review, { name: 'review' })
  findOne(@Args() args: FindUniqueReviewArgs) {
    return this.reviewsService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Review)
  async updateReview(
    @Args('updateReviewInput') args: UpdateReviewInput,
    @GetUser() user: GetUserType,
  ) {
    return this.reviewsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Review)
  async removeReview(
    @Args() args: FindUniqueReviewArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.reviewsService.remove(args);
  }

  @ResolveField(() => Customer)
  async customer(@Parent() review: Review) {
    return this.reviewsService.findCustomerByUid(review.customerId);
  }

  @ResolveField(() => Garage)
  async garage(@Parent() review: Review) {
    return this.reviewsService.findGarageById(review.garageId);
  }
}
