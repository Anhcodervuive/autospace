import { PartialType } from '@nestjs/swagger';
import { CreateBookingTimeline } from './create.dto';

export class UpdateBookingTimeline extends PartialType(CreateBookingTimeline) {}
