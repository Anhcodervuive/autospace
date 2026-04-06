import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateValet } from './create.dto';

export class UpdateValet extends PartialType(
  OmitType(CreateValet, ['uid'] as const),
) {}
