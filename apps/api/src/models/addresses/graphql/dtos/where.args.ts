import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args';

@InputType()
export class AddressWhereUniqueInput {
  id: number;
}

@InputType()
export class AddressWhereInputStrict implements RestrictProperties<
  AddressWhereInputStrict,
  Prisma.AddressWhereInput
> {
  id: IntFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  address: StringFilter;
  lat: FloatFilter;
  lng: FloatFilter;
  garageId: IntFilter;
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [AddressWhereInputStrict], { nullable: true })
  AND: Prisma.AddressWhereInput[];
  @Field(() => [AddressWhereInputStrict], { nullable: true })
  OR: Prisma.AddressWhereInput[];
  @Field(() => [AddressWhereInputStrict], { nullable: true })
  NOT: Prisma.AddressWhereInput[];
}

@InputType()
export class AddressWhereInput extends PartialType(AddressWhereInputStrict) {}

@InputType()
export class AddressListRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  every?: AddressWhereInput;
  @Field(() => AddressWhereInput, { nullable: true })
  some?: AddressWhereInput;
  @Field(() => AddressWhereInput, { nullable: true })
  none?: AddressWhereInput;
}

@InputType()
export class AddressRelationFilter {
  @Field(() => AddressWhereInput, { nullable: true })
  is?: AddressWhereInput;
  @Field(() => AddressWhereInput, { nullable: true })
  isNot?: AddressWhereInput;
}
