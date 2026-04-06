import { PartialType } from '@nestjs/swagger';
import { CreateAddress } from './create.dto';

export class UpdateAddress extends PartialType(CreateAddress) {}
