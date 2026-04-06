import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { CustomerRelationFilter } from 'src/models/customers/graphql/dtos/where.args';
import { ManagerRelationFilter } from 'src/models/managers/graphql/dtos/where.args';
import { ValetRelationFilter } from 'src/models/valets/graphql/dtos/where.args';

@InputType()
export class UserWhereUniqueInput {
  @Field(() => ID)
  uid: string;
}

@InputType()
export class UserWhereInputStrict implements RestrictProperties<
  UserWhereInputStrict,
  Omit<
    Prisma.UserWhereInput,
    'Credentials' | 'AuthProvider' | 'Admin' | 'image'
  >
> {
  Customer: CustomerRelationFilter;
  Manager: ManagerRelationFilter;
  Valet: ValetRelationFilter;
  uid: StringFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  name: StringFilter;

  @Field(() => [UserWhereInputStrict], { nullable: true })
  AND: Prisma.UserWhereInput[];
  @Field(() => [UserWhereInputStrict], { nullable: true })
  OR: Prisma.UserWhereInput[];
  @Field(() => [UserWhereInputStrict], { nullable: true })
  NOT: Prisma.UserWhereInput[];
}

@InputType()
export class UserWhereInput extends PartialType(UserWhereInputStrict) {}

@InputType()
export class UserListRelationFilter {
  every?: UserWhereInput;
  some?: UserWhereInput;
  none?: UserWhereInput;
}
@InputType()
export class UserRelationFilter {
  @Field(() => UserWhereInput, { nullable: true })
  is?: UserWhereInput;

  @Field(() => UserWhereInput, { nullable: true })
  isNot?: UserWhereInput;
}
