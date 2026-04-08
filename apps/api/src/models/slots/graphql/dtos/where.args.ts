import {
  Field,
  InputType,
  PartialType,
  registerEnumType,
} from '@nestjs/graphql';
import { $Enums, Prisma } from '@prisma/client';
import {
  DateTimeFilter,
  FloatFilter,
  IntFilter,
  RestrictProperties,
  StringFilter,
} from 'src/common/dtos/common.input';
import { BookingListRelationFilter } from 'src/models/bookings/graphql/dtos/where.args';
import { GarageRelationFilter } from 'src/models/garages/graphql/dtos/where.args';

registerEnumType($Enums.SlotType, {
  name: 'SlotType',
});

@InputType()
export class SlotWhereUniqueInput {
  id: number;
}

@InputType()
export class EnumSlotTypeFilter {
  @Field(() => $Enums.SlotType, { nullable: true })
  equals?: $Enums.SlotType;
  @Field(() => [$Enums.SlotType], { nullable: true })
  in?: $Enums.SlotType[];
  @Field(() => [$Enums.SlotType], { nullable: true })
  notIn?: $Enums.SlotType[];
  @Field(() => $Enums.SlotType, { nullable: true })
  not?: $Enums.SlotType;
}

@InputType()
export class SlotWhereInputStrict implements RestrictProperties<
  SlotWhereInputStrict,
  Prisma.SlotWhereInput
> {
  id: IntFilter;
  createdAt: DateTimeFilter;
  updatedAt: DateTimeFilter;
  displayName: StringFilter;
  pricePerHour: FloatFilter;
  length: IntFilter;
  width: IntFilter;
  height: IntFilter;

  type: EnumSlotTypeFilter;
  garageId: IntFilter;
  @Field(() => GarageRelationFilter, { nullable: true })
  Garage: GarageRelationFilter;
  @Field(() => BookingListRelationFilter, { nullable: true })
  Bookings: BookingListRelationFilter;
  // Todo: Add the below field decorator only to the $Enums types.
  // @Field(() => $Enums.x)

  @Field(() => [SlotWhereInputStrict], { nullable: true })
  AND: SlotWhereInput[];
  @Field(() => [SlotWhereInputStrict], { nullable: true })
  OR: SlotWhereInput[];
  @Field(() => [SlotWhereInputStrict], { nullable: true })
  NOT: SlotWhereInput[];
}

@InputType()
export class SlotWhereInput extends PartialType(SlotWhereInputStrict) {}

@InputType()
export class SlotListRelationFilter {
  @Field(() => SlotWhereInput, { nullable: true })
  every?: SlotWhereInput;
  @Field(() => SlotWhereInput, { nullable: true })
  some?: SlotWhereInput;
  @Field(() => SlotWhereInput, { nullable: true })
  none?: SlotWhereInput;
}

@InputType()
export class SlotRelationFilter {
  @Field(() => SlotWhereInput, { nullable: true })
  is?: SlotWhereInput;
  @Field(() => SlotWhereInput, { nullable: true })
  isNot?: SlotWhereInput;
}
