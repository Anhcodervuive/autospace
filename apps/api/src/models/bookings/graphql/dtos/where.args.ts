import {
  Field,
  InputType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { BookingStatus, Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { BookingTimelineListRelationFilter } from 'src/models/booking-timelines/graphql/dtos/where.args';
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args';
import { SlotRelationFilter } from 'src/models/slots/graphql/dtos/where.args';
import { ValetAssignmentRelationFilter } from 'src/models/valet-assignments/graphql/dtos/where.args';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});

@InputType()
export class BookingWhereUniqueInput {
  id: number;
}

@InputType()
export class EnumBookingStatusFilter {
  @Field(() => BookingStatus, { nullable: true })
  equals: BookingStatus;
  @Field(() => [BookingStatus], { nullable: true })
  in: BookingStatus[];
  @Field(() => [BookingStatus], { nullable: true })
  notIn: BookingStatus[];
  @Field(() => BookingStatus, { nullable: true })
  not: BookingStatus;
}

@InputType()
export class BookingWhereInputStrict implements RestrictProperties<
  BookingWhereInputStrict,
  Prisma.BookingWhereInput
> {
  id: IntFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  pricePerHour: FloatFilter;
  totalPrice: FloatFilter;
  startTime: DateTimeFilter;
  endTime: DateTimeFilter;
  vehicleNumber: StringFilter;
  phoneNumber: StringFilter;
  passcode: StringFilter;

  status: EnumBookingStatusFilter;
  slotId: IntFilter;
  customerId: StringFilter;
  @Field(() => ValetAssignmentRelationFilter, { nullable: true })
  ValetAssignment: ValetAssignmentRelationFilter;
  @Field(() => CustomerRelationFilter, { nullable: true })
  Customer: CustomerRelationFilter;
  @Field(() => SlotRelationFilter, { nullable: true })
  Slot: SlotRelationFilter;
  @Field(() => BookingTimelineListRelationFilter, { nullable: true })
  BookingTimeline: BookingTimelineListRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [BookingWhereInputStrict], { nullable: true })
  AND: Prisma.BookingWhereInput[];
  @Field(() => [BookingWhereInputStrict], { nullable: true })
  OR: Prisma.BookingWhereInput[];
  @Field(() => [BookingWhereInputStrict], { nullable: true })
  NOT: Prisma.BookingWhereInput[];
}

@InputType()
export class BookingWhereInput extends PartialType(BookingWhereInputStrict) {}

@InputType()
export class BookingListRelationFilter {
  @Field(() => BookingWhereInput, { nullable: true })
  every?: BookingWhereInput;
  @Field(() => BookingWhereInput, { nullable: true })
  some?: BookingWhereInput;
  @Field(() => BookingWhereInput, { nullable: true })
  none?: BookingWhereInput;
}

@InputType()
export class BookingRelationFilter {
  @Field(() => BookingWhereInput, { nullable: true })
  is?: BookingWhereInput;
  @Field(() => BookingWhereInput, { nullable: true })
  isNot?: BookingWhereInput;
}
