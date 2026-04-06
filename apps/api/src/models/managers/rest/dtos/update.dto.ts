import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateManager } from './create.dto';

export class UpdateManager extends PartialType(
  OmitType(CreateManager, ['uid'] as const),
) {}
