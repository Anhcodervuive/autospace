import { Field, InputType, PartialType } from '@nestjs/graphql';
import { $Enums, Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { BookingRelationFilter } from 'src/models/bookings/graphql/dtos/where.args';
import { ManagerRelationFilter } from 'src/models/managers/graphql/dtos/where.args';
import { ValetRelationFilter } from 'src/models/valets/graphql/dtos/where.args';

@InputType()
export class BookingTimelineWhereUniqueInput {
  id: number;
}

@InputType()
export class BookingTimelineWhereInputStrict implements RestrictProperties<
  BookingTimelineWhereInputStrict,
  Prisma.BookingTimelineWhereInput
> {
  id: IntFilter;
  timestamp: DateTimeFilter;
  @Field(() => $Enums.BookingStatus)
  status: $Enums.BookingStatus;
  bookingId: IntFilter;
  valetId: StringFilter;
  managerId: StringFilter;
  @Field(() => BookingRelationFilter, { nullable: true })
  Booking: BookingRelationFilter;
  @Field(() => ValetRelationFilter, { nullable: true })
  Valet: ValetRelationFilter;
  @Field(() => ManagerRelationFilter, { nullable: true })
  Manager: ManagerRelationFilter;

  @Field(() => [BookingTimelineWhereInputStrict], { nullable: true })
  AND: Prisma.BookingTimelineWhereInput[];
  @Field(() => [BookingTimelineWhereInputStrict], { nullable: true })
  OR: Prisma.BookingTimelineWhereInput[];
  @Field(() => [BookingTimelineWhereInputStrict], { nullable: true })
  NOT: Prisma.BookingTimelineWhereInput[];
}

@InputType()
export class BookingTimelineWhereInput extends PartialType(
  BookingTimelineWhereInputStrict,
) {}

@InputType()
export class BookingTimelineListRelationFilter {
  @Field(() => BookingTimelineWhereInput, { nullable: true })
  every?: BookingTimelineWhereInput;
  @Field(() => BookingTimelineWhereInput, { nullable: true })
  some?: BookingTimelineWhereInput;
  @Field(() => BookingTimelineWhereInput, { nullable: true })
  none?: BookingTimelineWhereInput;
}

@InputType()
export class BookingTimelineRelationFilter {
  @Field(() => BookingTimelineWhereInput, { nullable: true })
  is?: BookingTimelineWhereInput;
  @Field(() => BookingTimelineWhereInput, { nullable: true })
  isNot?: BookingTimelineWhereInput;
}
