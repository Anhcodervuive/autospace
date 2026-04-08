import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { BookingRelationFilter } from 'src/models/bookings/graphql/dtos/where.args';
import { ValetRelationFilter } from 'src/models/valets/graphql/dtos/where.args';

@InputType()
export class ValetAssignmentWhereUniqueInput {
  bookingId: number;
}

@InputType()
export class ValetAssignmentWhereInputStrict implements RestrictProperties<
  ValetAssignmentWhereInputStrict,
  Prisma.ValetAssignmentWhereInput
> {
  bookingId: IntFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  pickupLat: FloatFilter;
  pickupLng: FloatFilter;
  returnLat: FloatFilter;
  returnLng: FloatFilter;
  pickupValetId: StringFilter;
  returnValetId: StringFilter;
  @Field(() => ValetRelationFilter, { nullable: true })
  PickupValet: ValetRelationFilter;
  @Field(() => ValetRelationFilter, { nullable: true })
  ReturnValet: ValetRelationFilter;
  @Field(() => BookingRelationFilter, { nullable: true })
  Booking: BookingRelationFilter;

  @Field(() => [ValetAssignmentWhereInputStrict], { nullable: true })
  AND: ValetAssignmentWhereInput[];
  @Field(() => [ValetAssignmentWhereInputStrict], { nullable: true })
  OR: ValetAssignmentWhereInput[];
  @Field(() => [ValetAssignmentWhereInputStrict], { nullable: true })
  NOT: ValetAssignmentWhereInput[];
}

@InputType()
export class ValetAssignmentWhereInput extends PartialType(
  ValetAssignmentWhereInputStrict,
) {}

@InputType()
export class ValetAssignmentListRelationFilter {
  @Field(() => ValetAssignmentWhereInput, { nullable: true })
  every?: ValetAssignmentWhereInput;
  @Field(() => ValetAssignmentWhereInput, { nullable: true })
  some?: ValetAssignmentWhereInput;
  @Field(() => ValetAssignmentWhereInput, { nullable: true })
  none?: ValetAssignmentWhereInput;
}

@InputType()
export class ValetAssignmentRelationFilter {
  @Field(() => ValetAssignmentWhereInput, { nullable: true })
  is?: ValetAssignmentWhereInput;
  @Field(() => ValetAssignmentWhereInput, { nullable: true })
  isNot?: ValetAssignmentWhereInput;
}
