import { PartialType } from '@nestjs/swagger';
import { CreateVerification } from './create.dto';

export class UpdateVerification extends PartialType(CreateVerification) {}
