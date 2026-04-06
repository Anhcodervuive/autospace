import { PartialType } from '@nestjs/swagger';
import { CreateBooking } from './create.dto';

export class UpdateBooking extends PartialType(CreateBooking) {}
