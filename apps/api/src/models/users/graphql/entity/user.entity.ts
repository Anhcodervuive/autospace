import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql';
import { $Enums, User as UserType } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

@ObjectType()
export class User implements RestrictProperties<User, UserType> {
  @Field(() => ID)
  uid: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  image: string | null;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}

@ObjectType()
export class AuthProvider {
  @Field(() => ID)
  uid: string;

  @Field(() => $Enums.AuthProviderType)
  type: $Enums.AuthProviderType;
}
