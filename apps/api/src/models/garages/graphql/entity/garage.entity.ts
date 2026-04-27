import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Garage as GarageType, SlotType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Garage implements RestrictProperties<Garage, GarageType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => String, { nullable: true })
  displayName: string;
  @Field(() => Number)
  companyId: number;
  @Field(() => Number)
  id: number;
  @Field(() => String, { nullable: true })
  description: string;
  @Field(() => [String])
  images: string[];
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}

@ObjectType()
export class SlotTypeCount {
  @Field(() => SlotType)
  type: SlotType;

  count: number;
}
