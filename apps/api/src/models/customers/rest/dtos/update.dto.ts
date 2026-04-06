import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateCustomer } from './create.dto';

export class UpdateCustomer extends PartialType(
  OmitType(CreateCustomer, ['uid'] as const),
) {}
