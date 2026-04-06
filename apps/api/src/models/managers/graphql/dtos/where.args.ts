import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { BookingTimelineListRelationFilter } from 'src/models/booking-timelines/graphql/dtos/where.args';
import { CompanyRelationFilter } from 'src/models/companies/graphql/dtos/where.args';
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args';

@InputType()
export class ManagerWhereUniqueInput {
  uid: string;
}

@InputType()
export class ManagerWhereInputStrict implements RestrictProperties<
  ManagerWhereInputStrict,
  Prisma.ManagerWhereInput
> {
  @Field(() => UserRelationFilter, { nullable: true })
  user: UserRelationFilter;
  uid: StringFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  displayName: StringFilter;
  companyId: IntFilter;
  @Field(() => CompanyRelationFilter, { nullable: true })
  Company: CompanyRelationFilter;
  @Field(() => BookingTimelineListRelationFilter, { nullable: true })
  BookingTimeline: BookingTimelineListRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [ManagerWhereInputStrict], { nullable: true })
  AND: Prisma.ManagerWhereInput[];
  @Field(() => [ManagerWhereInputStrict], { nullable: true })
  OR: Prisma.ManagerWhereInput[];
  @Field(() => [ManagerWhereInputStrict], { nullable: true })
  NOT: Prisma.ManagerWhereInput[];
}

@InputType()
export class ManagerWhereInput extends PartialType(ManagerWhereInputStrict) {}

@InputType()
export class ManagerListRelationFilter {
  @Field(() => ManagerWhereInput, { nullable: true })
  every?: ManagerWhereInput;
  @Field(() => ManagerWhereInput, { nullable: true })
  some?: ManagerWhereInput;
  @Field(() => ManagerWhereInput, { nullable: true })
  none?: ManagerWhereInput;
}

@InputType()
export class ManagerRelationFilter {
  @Field(() => ManagerWhereInput, { nullable: true })
  is?: ManagerWhereInput;
  @Field(() => ManagerWhereInput, { nullable: true })
  isNot?: ManagerWhereInput;
}
