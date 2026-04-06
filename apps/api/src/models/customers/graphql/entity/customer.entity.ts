import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Customer as CustomerType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Customer implements RestrictProperties<Customer, CustomerType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => ID)
  uid: string;
  @Field(() => String, { nullable: true })
  displayName: string;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
