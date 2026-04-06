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
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Address } from 'src/models/addresses/graphql/entity/address.entity';
import { Company } from 'src/models/companies/graphql/entity/company.entity';
import { Review } from 'src/models/reviews/graphql/entity/review.entity';
import { Slot } from 'src/models/slots/graphql/entity/slot.entity';
import { Verification } from 'src/models/verifications/graphql/entity/verification.entity';

@Resolver(() => Garage)
export class GaragesResolver {
  constructor(
    private readonly garagesService: GaragesService,
    private readonly prisma: PrismaService,
  ) {}

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

  @AllowAuthenticated()
  @Mutation(() => Garage)
  async updateGarage(
    @Args('updateGarageInput') args: UpdateGarageInput,
    @GetUser() user: GetUserType,
  ) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: args.id },
    });
    return this.garagesService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Garage)
  async removeGarage(
    @Args() args: FindUniqueGarageArgs,
    @GetUser() user: GetUserType,
  ) {
    const garage = await this.prisma.garage.findUnique(args);
    return this.garagesService.remove(args);
  }

  @ResolveField(() => Company)
  async company(@Parent() garage: Garage) {
    return this.prisma.company.findUnique({
      where: { id: garage.companyId },
    });
  }

  @ResolveField(() => Address, { nullable: true })
  async address(@Parent() garage: Garage) {
    return this.prisma.address.findUnique({
      where: { garageId: garage.id },
    });
  }

  @ResolveField(() => Verification, { nullable: true })
  async verification(@Parent() garage: Garage) {
    return this.prisma.verification.findUnique({
      where: { garageId: garage.id },
    });
  }

  @ResolveField(() => [Review], { nullable: true })
  async reviews(@Parent() garage: Garage) {
    return this.prisma.review.findMany({
      where: { garageId: garage.id },
    });
  }

  @ResolveField(() => [Slot], { nullable: true })
  async slots(@Parent() garage: Garage) {
    return this.prisma.slot.findMany({
      where: { garageId: garage.id },
    });
  }
}
