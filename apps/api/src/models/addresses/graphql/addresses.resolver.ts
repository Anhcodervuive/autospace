import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AddressesService } from './addresses.service';
import { Address } from './entity/address.entity';
import { FindManyAddressArgs, FindUniqueAddressArgs } from './dtos/find.args';
import { CreateAddressInput } from './dtos/create-address.input';
import { UpdateAddressInput } from './dtos/update-address.input';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';

@Resolver(() => Address)
export class AddressesResolver {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated()
  @Mutation(() => Address)
  createAddress(@Args('createAddressInput') args: CreateAddressInput) {
    return this.addressesService.create(args);
  }

  @Query(() => [Address], { name: 'addresses' })
  findAll(@Args() args: FindManyAddressArgs) {
    return this.addressesService.findAll(args);
  }

  @Query(() => Address, { name: 'address' })
  findOne(@Args() args: FindUniqueAddressArgs) {
    return this.addressesService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Address)
  async updateAddress(@Args('updateAddressInput') args: UpdateAddressInput) {
    return this.addressesService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Address)
  async removeAddress(@Args() args: FindUniqueAddressArgs) {
    return this.addressesService.remove(args);
  }

  @ResolveField(() => Garage)
  async garage(@Parent() address: Address) {
    return this.prisma.garage.findFirst({
      where: { id: address.garageId },
    });
  }
}
