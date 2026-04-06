import { OmitType } from '@nestjs/swagger';
import { CreateVerification } from './create.dto';

export class DeleteVerification extends OmitType(CreateVerification, [
  'verified',
]) {}
