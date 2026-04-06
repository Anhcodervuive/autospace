import { BookingStatus, BookingTimeline } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class BookingTimelineEntity implements RestrictProperties<
  BookingTimelineEntity,
  BookingTimeline
> {
  id: number;
  timestamp: Date;
  status: BookingStatus;
  bookingId: number;
  valetId: string;
  managerId: string;
}
