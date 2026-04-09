import {
  Field,
  InputType,
  ObjectType,
  PickType,
  registerEnumType,
} from '@nestjs/graphql';
import { User } from '../entity/user.entity';
import { $Enums, AuthProviderType } from '@prisma/client';

registerEnumType($Enums.AuthProviderType, {
  name: 'AuthProviderType',
});

@InputType()
export class RegisterUserWithProviderInput extends PickType(
  User,
  ['uid', 'name', 'image'],
  InputType,
) {
  @Field(() => AuthProviderType)
  type: AuthProviderType;
}

@InputType()
export class RegisterUserWithCredentialInput {
  @Field(() => String)
  name: string;
  @Field(() => String)
  email: string;
  @Field(() => String)
  password: string;
  @Field(() => String, { nullable: true })
  image?: string;
}

@InputType()
export class LoginInput extends PickType(
  RegisterUserWithCredentialInput,
  ['email', 'password'],
  InputType,
) {}

@ObjectType()
export class UserPublic extends PickType(
  User,
  ['uid', 'name', 'image'],
  ObjectType,
) {}

@ObjectType()
export class LoginOutPut {
  @Field(() => String)
  token: string;
  @Field(() => UserPublic)
  user: UserPublic;
}
