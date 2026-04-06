import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Manager as ManagerType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Manager implements RestrictProperties<Manager, ManagerType> {
  @Field(() => ID)
  uid: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => String, { nullable: true })
  displayName: string;
  @Field(() => Number, { nullable: true })
  companyId: number;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
