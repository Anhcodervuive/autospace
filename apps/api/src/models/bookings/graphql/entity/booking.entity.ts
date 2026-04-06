import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { $Enums, Booking as BookingType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

registerEnumType($Enums.BookingStatus, {
  name: 'BookingStatus',
});

@ObjectType()
export class Booking implements RestrictProperties<Booking, BookingType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => ID)
  id: number;
  @Field(() => Float, { nullable: true })
  pricePerHour: number;
  @Field(() => Float, { nullable: true })
  totalPrice: number;
  @Field(() => GraphQLISODateTime)
  startTime: Date;
  @Field(() => GraphQLISODateTime)
  endTime: Date;
  @Field(() => String)
  vehicleNumber: string;
  @Field(() => String, { nullable: true })
  phoneNumber: string;
  @Field(() => String, { nullable: true })
  passcode: string;
  @Field(() => $Enums.BookingStatus)
  status: $Enums.BookingStatus;
  @Field(() => ID)
  slotId: number;
  @Field(() => ID)
  customerId: string;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
