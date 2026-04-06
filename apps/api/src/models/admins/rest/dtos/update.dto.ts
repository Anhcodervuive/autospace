import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAdmin } from './create.dto';

export class UpdateAdmin extends PartialType(
  OmitType(CreateAdmin, ['uid'] as const),
) {}
