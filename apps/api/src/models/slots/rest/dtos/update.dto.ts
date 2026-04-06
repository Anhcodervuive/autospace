import { PartialType } from '@nestjs/swagger';
import { CreateSlot } from './create.dto';

export class UpdateSlot extends PartialType(CreateSlot) {}
