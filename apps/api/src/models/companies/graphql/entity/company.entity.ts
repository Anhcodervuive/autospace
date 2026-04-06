import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { Company as CompanyType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Company implements RestrictProperties<Company, CompanyType> {
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  @Field(() => String, { nullable: true })
  displayName: string;
  @Field(() => ID)
  id: number;
  @Field(() => String, { nullable: true })
  description: string;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
