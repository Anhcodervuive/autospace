import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Valet as ValetType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Valet implements RestrictProperties<Valet, ValetType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => String)
  displayName: string;
  @Field(() => ID, { nullable: true })
  companyId: number;
  @Field(() => ID)
  uid: string;
  @Field(() => String, { nullable: true })
  image: string;
  @Field(() => String)
  licenceId: string;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
