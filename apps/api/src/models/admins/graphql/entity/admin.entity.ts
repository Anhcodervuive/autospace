import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Admin as AdminType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Admin implements RestrictProperties<Admin, AdminType> {
  @Field(() => ID)
  uid: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
