import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
} from '@nestjs/graphql';
import { Address as AddressType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Address implements RestrictProperties<Address, AddressType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => ID)
  id: number;
  @Field(() => ID)
  garageId: number;
  @Field(() => String)
  address: string;
  @Field(() => Float)
  lat: number;
  @Field(() => Float)
  lng: number;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
