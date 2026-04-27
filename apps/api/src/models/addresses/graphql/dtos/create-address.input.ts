import { InputType, PickType } from '@nestjs/graphql';
import { Address } from '../entity/address.entity';

@InputType()
export class CreateAddressInput extends PickType(
  Address,
  ['id', 'address', 'lat', 'lng', 'garageId'],
  InputType,
) {}

@InputType()
export class CreateAddressInputWithoutGarageId extends PickType(
  CreateAddressInput,
  ['address', 'lat', 'lng'],
  InputType,
) {}
