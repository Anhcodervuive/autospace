import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { VerificationsService } from './verifications.service';
import { Verification } from './entity/verification.entity';
import {
  FindManyVerificationArgs,
  FindUniqueVerificationArgs,
} from './dtos/find.args';
import { CreateVerificationInput } from './dtos/create-verification.input';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { Admin } from 'src/models/admins/graphql/entity/admin.entity';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';
import type { GetUserType } from 'src/common/types';

@Resolver(() => Verification)
export class VerificationsResolver {
  constructor(private readonly verificationsService: VerificationsService) {}

  @AllowAuthenticated('admin')
  @Mutation(() => Verification)
  createVerification(
    @Args('createVerificationInput') args: CreateVerificationInput,
    @GetUser() user: GetUserType,
  ) {
    return this.verificationsService.create({
      ...args,
      adminId: user.uid,
    });
  }

  @Query(() => [Verification], { name: 'verifications' })
  findAll(@Args() args: FindManyVerificationArgs) {
    return this.verificationsService.findAll(args);
  }

  @Query(() => Verification, { name: 'verification' })
  findOne(@Args() args: FindUniqueVerificationArgs) {
    return this.verificationsService.findOne(args);
  }

  @AllowAuthenticated('admin')
  @Mutation(() => Verification)
  async removeVerification(@Args() args: FindUniqueVerificationArgs) {
    return this.verificationsService.remove(args);
  }

  @ResolveField(() => Admin)
  async admin(@Parent() verification: Verification) {
    return this.verificationsService.findAdminByUid(verification.adminId);
  }

  @ResolveField(() => Garage)
  async garage(@Parent() verification: Verification) {
    return this.verificationsService.findGarageById(verification.garageId);
  }
}
