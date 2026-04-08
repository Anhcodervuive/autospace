import { Injectable } from '@nestjs/common';
import { FindManyBookingArgs, FindUniqueBookingArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookingInput } from './dtos/create-booking.input';
import { UpdateBookingInput } from './dtos/update-booking.input';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBookingInput: CreateBookingInput) {
    return this.prisma.booking.create({ data: createBookingInput as any });
  }

  findAll(args: FindManyBookingArgs) {
    return this.prisma.booking.findMany(args);
  }

  findOne(args: FindUniqueBookingArgs) {
    return this.prisma.booking.findUnique(args);
  }

  update(updateBookingInput: UpdateBookingInput) {
    const { id, ...data } = updateBookingInput;
    return this.prisma.booking.update({
      where: { id },
      data: data,
    });
  }

  remove(args: FindUniqueBookingArgs) {
    return this.prisma.booking.delete(args);
  }

  findSlotById(id: number) {
    return this.prisma.slot.findUnique({
      where: { id },
    });
  }

  findCustomerByUid(uid: string) {
    return this.prisma.customer.findUnique({
      where: { uid },
    });
  }

  findValetAssignmentByBookingId(bookingId: number) {
    return this.prisma.valetAssignment.findUnique({
      where: { bookingId },
    });
  }

  findTimelinesByBookingId(bookingId: number) {
    return this.prisma.bookingTimeline.findMany({
      where: { bookingId },
    });
  }
}
