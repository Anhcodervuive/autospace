import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entity/company.entity';
import { FindManyCompanyArgs, FindUniqueCompanyArgs } from './dtos/find.args';
import { CreateCompanyInput } from './dtos/create-company.input';
import { UpdateCompanyInput } from './dtos/update-company.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import type { GetUserType } from 'src/common/types';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import { ForbiddenException } from '@nestjs/common';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';
import { Manager } from 'src/models/managers/graphql/entity/manager.entity';
import { Valet } from 'src/models/valets/graphql/entity/valet.entity';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) {}

  @AllowAuthenticated()
  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') args: CreateCompanyInput,
    @GetUser() user: GetUserType,
  ) {
    const managerId = args.managerId;
    checkRowLevelPermission({
      user,
      requestedUid: managerId,
    });
    return this.companiesService.create(args);
  }

  @AllowAuthenticated()
  @Query(() => [Company], { name: 'companies' })
  findAll(@Args() args: FindManyCompanyArgs) {
    return this.companiesService.findAll(args);
  }

  @AllowAuthenticated()
  @Query(() => Company)
  myCompany(@GetUser() user: GetUserType) {
    return this.companiesService.findOneByManager(user.uid);
  }

  @Query(() => Company, { name: 'company' })
  findOne(@Args() args: FindUniqueCompanyArgs) {
    return this.companiesService.findOne(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Company)
  async updateCompany(
    @Args('updateCompanyInput') args: UpdateCompanyInput,
    @GetUser() user: GetUserType,
  ) {
    const company = await this.companiesService.findOneWithManagers(args.id);
    const isPermitted = checkRowLevelPermission({
      user,
      requestedUid: company?.Managers.map((m) => m.uid),
      roles: ['admin', 'manager'],
    });
    if (!isPermitted) {
      throw new ForbiddenException();
    }
    return this.companiesService.update(args);
  }

  @AllowAuthenticated()
  @Mutation(() => Company)
  async removeCompany(
    @Args() args: FindUniqueCompanyArgs,
    @GetUser() user: GetUserType,
  ) {
    const company = await this.companiesService.findOneWithManagers(
      args.where.id,
    );
    const isPermitted = checkRowLevelPermission({
      user,
      requestedUid: company?.Managers.map((m) => m.uid),
      roles: ['admin', 'manager'],
    });
    if (!isPermitted) {
      throw new ForbiddenException();
    }
    return this.companiesService.remove(args);
  }

  @ResolveField(() => [Garage], { nullable: true })
  async garages(@Parent() company: Company) {
    return this.companiesService.findGaragesByCompanyId(company.id);
  }

  @ResolveField(() => [Manager], { nullable: true })
  async managers(@Parent() company: Company) {
    return this.companiesService.findManagersByCompanyId(company.id);
  }

  @ResolveField(() => [Valet], { nullable: true })
  async valets(@Parent() company: Company) {
    return this.companiesService.findValetsByCompanyId(company.id);
  }
}
