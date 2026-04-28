import { Injectable } from '@nestjs/common';
import {
  FindManyBookingTimelineArgs,
  FindUniqueBookingTimelineArgs,
} from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookingTimelineInput } from './dtos/create-booking-timeline.input';
import { UpdateBookingTimelineInput } from './dtos/update-booking-timeline.input';
import { GetUserType } from 'src/common/types';
import { checkRowLevelPermission } from 'src/common/auth/util';

@Injectable()
export class BookingTimelinesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createBookingTimelineInput: CreateBookingTimelineInput,
    user: GetUserType,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: createBookingTimelineInput.bookingId },
      include: {
        Slot: {
          include: {
            Garage: {
              include: {
                Company: {
                  select: { Managers: { select: { uid: true } } },
                },
              },
            },
          },
        },
      },
    });

    checkRowLevelPermission({
      user,
      requestedUid: booking.Slot.Garage.Company.Managers.map(
        (manager) => manager.uid,
      ),
    });
    const [, bookingTimeline] = await this.prisma.$transaction([
      this.prisma.booking.update({
        data: { status: createBookingTimelineInput.status },
        where: { id: booking.id },
      }),
      this.prisma.bookingTimeline.create({
        data: {
          bookingId: booking.id,
          managerId: user.uid,
          status: createBookingTimelineInput.status,
        },
      }),
    ]);

    return bookingTimeline;
  }

  findAll(args: FindManyBookingTimelineArgs) {
    return this.prisma.bookingTimeline.findMany(args);
  }

  findOne(args: FindUniqueBookingTimelineArgs) {
    return this.prisma.bookingTimeline.findUnique(args);
  }

  update(updateBookingTimelineInput: UpdateBookingTimelineInput) {
    const { id, ...data } = updateBookingTimelineInput;
    return this.prisma.bookingTimeline.update({
      where: { id },
      data: data,
    });
  }

  remove(args: FindUniqueBookingTimelineArgs) {
    return this.prisma.bookingTimeline.delete(args);
  }

  findBookingById(id: number) {
    return this.prisma.booking.findUnique({
      where: { id },
    });
  }

  findValetByUid(uid: string) {
    return this.prisma.valet.findUnique({
      where: { uid },
    });
  }

  findManagerByUid(uid: string) {
    return this.prisma.manager.findUnique({
      where: { uid },
    });
  }
}
