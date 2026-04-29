import { Field, Float, ObjectType } from '@nestjs/graphql';
import { ValetAssignment as ValetAssignmentType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class ValetAssignment implements RestrictProperties<
  ValetAssignment,
  ValetAssignmentType
> {
  bookingId: number;
  createdAt: Date;
  updatedAt: Date;
  @Field(() => Float)
  pickupLat: number;
  @Field(() => Float)
  pickupLng: number;
  @Field(() => Float)
  returnLat: number;
  @Field(() => Float)
  returnLng: number;
  @Field({ nullable: true })
  pickupValetId: string;
  @Field({ nullable: true })
  returnValetId: string;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
