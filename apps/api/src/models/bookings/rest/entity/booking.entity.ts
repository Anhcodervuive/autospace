import { Booking, BookingStatus } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class BookingEntity implements RestrictProperties<
  BookingEntity,
  Booking
> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  pricePerHour: number;
  totalPrice: number;
  startTime: Date;
  endTime: Date;
  vehicleNumber: string;
  phoneNumber: string;
  passcode: string;
  status: BookingStatus;
  slotId: number;
  customerId: string;
}
