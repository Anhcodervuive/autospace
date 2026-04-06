import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { GarageListRelationFilter } from 'src/models/garages/graphql/dtos/where.args';
import { ManagerListRelationFilter } from 'src/models/managers/graphql/dtos/where.args';
import { ValetListRelationFilter } from 'src/models/valets/graphql/dtos/where.args';

@InputType()
export class CompanyWhereUniqueInput {
  id: number;
}

@InputType()
export class CompanyWhereInputStrict implements RestrictProperties<
  CompanyWhereInputStrict,
  Prisma.CompanyWhereInput
> {
  id: IntFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  displayName: StringFilter;
  description: StringFilter;
  Garages: GarageListRelationFilter;
  Managers: ManagerListRelationFilter;
  Valets: ValetListRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  AND: Prisma.CompanyWhereInput[];
  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  OR: Prisma.CompanyWhereInput[];
  @Field(() => [CompanyWhereInputStrict], { nullable: true })
  NOT: Prisma.CompanyWhereInput[];
}

@InputType()
export class CompanyWhereInput extends PartialType(CompanyWhereInputStrict) {}

@InputType()
export class CompanyListRelationFilter {
  every?: CompanyWhereInput;
  some?: CompanyWhereInput;
  none?: CompanyWhereInput;
}

@InputType()
export class CompanyRelationFilter {
  is?: CompanyWhereInput;
  isNot?: CompanyWhereInput;
}
