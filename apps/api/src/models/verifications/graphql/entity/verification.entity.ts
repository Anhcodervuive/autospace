import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
import { Verification as VerificationType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class Verification implements RestrictProperties<
  Verification,
  VerificationType
> {
  @Field(() => Number)
  garageId: number;
  @Field(() => Boolean)
  verified: boolean;
  @Field(() => String)
  adminId: string;
  @Field(() => GraphQLISODateTime)
  createdAt: Date;
  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
  // Todo Add below to make optional fields optional.
  // @Field({ nullable: true })
}
