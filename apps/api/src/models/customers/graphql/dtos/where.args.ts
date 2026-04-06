import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { ReviewListRelationFilter } from 'src/models/reviews/graphql/dtos/where.args';
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args';
import { UserRelationFilter } from 'src/models/users/graphql/dtos/where.args';

@InputType()
export class CustomerWhereUniqueInput {
  uid: string;
}

@InputType()
export class CustomerWhereInputStrict implements RestrictProperties<
  CustomerWhereInputStrict,
  Prisma.CustomerWhereInput
> {
  @Field(() => UserRelationFilter, { nullable: true })
  user: UserRelationFilter;
  uid: StringFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  displayName: StringFilter;
  @Field(() => BookingListRelationFilter, { nullable: true })
  Bookings: BookingListRelationFilter;
  @Field(() => ReviewListRelationFilter, { nullable: true })
  Reviews: ReviewListRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  AND: Prisma.CustomerWhereInput[];
  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  OR: Prisma.CustomerWhereInput[];
  @Field(() => [CustomerWhereInputStrict], { nullable: true })
  NOT: Prisma.CustomerWhereInput[];
}

@InputType()
export class CustomerWhereInput extends PartialType(CustomerWhereInputStrict) {}

@InputType()
export class CustomerListRelationFilter {
  @Field(() => CustomerWhereInput, { nullable: true })
  every?: CustomerWhereInput;
  @Field(() => CustomerWhereInput, { nullable: true })
  some?: CustomerWhereInput;
  @Field(() => CustomerWhereInput, { nullable: true })
  none?: CustomerWhereInput;
}

@InputType()
export class CustomerRelationFilter {
  @Field(() => CustomerWhereInput, { nullable: true })
  is?: CustomerWhereInput;
  @Field(() => CustomerWhereInput, { nullable: true })
  isNot?: CustomerWhereInput;
}
