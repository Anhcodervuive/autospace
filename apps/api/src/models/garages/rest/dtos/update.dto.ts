import { PartialType } from '@nestjs/swagger';
import { CreateGarage } from './create.dto';

export class UpdateGarage extends PartialType(CreateGarage) {}
