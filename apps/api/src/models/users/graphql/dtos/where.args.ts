import { Field, ID, InputType } from '@nestjs/graphql';
import { DateTimeFilter, StringFilter } from 'src/common/dtos/common.input';

@InputType()
export class UserWhereUniqueInput {
  @Field(() => ID)
  uid: string;
}

@InputType()
export class UserWhereInput {
  @Field(() => StringFilter, { nullable: true })
  uid?: StringFilter;

  @Field(() => StringFilter, { nullable: true })
  name?: StringFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  createdAt?: DateTimeFilter;

  @Field(() => DateTimeFilter, { nullable: true })
  updatedAt?: DateTimeFilter;

  @Field(() => [UserWhereInput], { nullable: true })
  AND?: UserWhereInput[];

  @Field(() => [UserWhereInput], { nullable: true })
  OR?: UserWhereInput[];

  @Field(() => [UserWhereInput], { nullable: true })
  NOT?: UserWhereInput[];
}

@InputType()
export class UserListRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  every?: UserWhereInput;

  @Field(() => UserWhereInput, { nullable: true })
  some?: UserWhereInput;

  @Field(() => UserWhereInput, { nullable: true })
  none?: UserWhereInput;
}

@InputType()
export class UserRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  is?: UserWhereInput;

  @Field(() => UserWhereInput, { nullable: true })
  isNot?: UserWhereInput;
}
