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
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { Garage } from 'src/models/garages/graphql/entity/garage.entity';
import { Manager } from 'src/models/managers/graphql/entity/manager.entity';
import { Valet } from 'src/models/valets/graphql/entity/valet.entity';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly prisma: PrismaService,
  ) {}

  @AllowAuthenticated('manager', 'admin')
  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') args: CreateCompanyInput,
    @GetUser() user: GetUserType,
  ) {
    return this.companiesService.create(args);
  }

  @Query(() => [Company], { name: 'companies' })
  findAll(@Args() args: FindManyCompanyArgs) {
    return this.companiesService.findAll(args);
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
    const company = await this.prisma.company.findUnique({
      where: { id: args.id },
      include: {
        Managers: {
          select: {
            uid: true,
          },
        },
      },
    });
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
    const company = await this.prisma.company.findUnique({
      where: { id: args.where.id },
      include: {
        Managers: {
          select: {
            uid: true,
          },
        },
      },
    });
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
    return this.prisma.garage.findMany({
      where: { companyId: company.id },
    });
  }

  @ResolveField(() => [Manager], { nullable: true })
  async managers(@Parent() company: Company) {
    return this.prisma.manager.findMany({
      where: { companyId: company.id },
    });
  }

  @ResolveField(() => [Valet], { nullable: true })
  async valets(@Parent() company: Company) {
    return this.prisma.valet.findMany({
      where: { companyId: company.id },
    });
  }
}
