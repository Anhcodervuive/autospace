import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ValetAssignmentsService } from './valet-assignments.service';
import { ValetAssignment } from './entity/valet-assignment.entity';
import {
  FindManyValetAssignmentArgs,
  FindUniqueValetAssignmentArgs,
} from './dtos/find.args';
import { CreateValetAssignmentInput } from './dtos/create-valet-assignment.input';
import { UpdateValetAssignmentInput } from './dtos/update-valet-assignment.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Booking } from 'src/models/bookings/graphql/entity/booking.entity';
import { Valet } from 'src/models/valets/graphql/entity/valet.entity';

@Resolver(() => ValetAssignment)
export class ValetAssignmentsResolver {
  constructor(
    private readonly valetAssignmentsService: ValetAssignmentsService,
  ) {}

  @AllowAuthenticated()
  @Mutation(() => ValetAssignment)
  createValetAssignment(
    @Args('createValetAssignmentInput') args: CreateValetAssignmentInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetAssignmentsService.create(args);
  }

  @Query(() => [ValetAssignment], { name: 'valetAssignments' })
  findAll(@Args() args: FindManyValetAssignmentArgs) {
    return this.valetAssignmentsService.findAll(args);
  }

  @Query(() => ValetAssignment, { name: 'valetAssignment' })
  findOne(@Args() args: FindUniqueValetAssignmentArgs) {
    return this.valetAssignmentsService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => ValetAssignment)
  async updateValetAssignment(
    @Args('updateValetAssignmentInput') args: UpdateValetAssignmentInput,
    @GetUser() user: GetUserType,
  ) {
    return this.valetAssignmentsService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => ValetAssignment)
  async removeValetAssignment(
    @Args() args: FindUniqueValetAssignmentArgs,
    @GetUser() user: GetUserType,
  ) {
    return this.valetAssignmentsService.remove(args);
  }

  @ResolveField(() => Valet, { nullable: true })
  async pickupValet(@Parent() valetAssignment: ValetAssignment) {
    if (!valetAssignment.pickupValetId) {
      return null;
    }
    return this.valetAssignmentsService.findValetByUid(
      valetAssignment.pickupValetId,
    );
  }

  @ResolveField(() => Valet, { nullable: true })
  async returnValet(@Parent() valetAssignment: ValetAssignment) {
    if (!valetAssignment.returnValetId) {
      return null;
    }
    return this.valetAssignmentsService.findValetByUid(
      valetAssignment.returnValetId,
    );
  }

  @ResolveField(() => Booking)
  async booking(@Parent() valetAssignment: ValetAssignment) {
    return this.valetAssignmentsService.findBookingById(
      valetAssignment.bookingId,
    );
  }
}
