import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FindManyBookingArgs, FindUniqueBookingArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateBookingInput } from './dtos/create-booking.input';
import { UpdateBookingInput } from './dtos/update-booking.input';
import { generateSixDigitNumber } from 'src/common/util';
import { SlotType } from '@prisma/client';
import type { GetUserType } from 'src/common/types';
import { checkRowLevelPermission } from 'src/common/auth/util';
import { BookingWhereInput } from './dtos/where.args';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(args: FindManyBookingArgs) {
    return this.prisma.booking.findMany(args);
  }

  async findAllBookingForGarages(args: FindManyBookingArgs, user: GetUserType) {
    const garageId = args.where.Slot.is.garageId.equals;
    if (!garageId) {
      throw new BadRequestException('Pass garage id in where.Slot.is.garageId');
    }
    const garages = await this.prisma.garage.findFirst({
      where: {
        id: garageId,
      },
      include: {
        Company: {
          include: {
            Managers: true,
          },
        },
      },
    });

    checkRowLevelPermission({
      user,
      requestedUid: garages.Company.Managers.map((manager) => manager.uid),
    });

    return this.prisma.booking.findMany({
      ...args,
      where: {
        ...args.where,
        ...(garageId
          ? { Slot: { is: { garageId: { equals: garageId } } } }
          : null),
      },
    });
  }

  async getBookingCount(where: BookingWhereInput) {
    const bookings = await this.prisma.booking.aggregate({
      where,
      _count: { _all: true },
    });
    return { count: bookings._count._all };
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

  async create({
    customerId,
    endTime,
    garageId,
    startTime,
    type,
    vehicleNumber,
    phoneNumber,
    pricePerHour,
    totalPrice,
    valetAssignment,
  }: CreateBookingInput) {
    // Create customer
    const customer = await this.prisma.customer.findUnique({
      where: { uid: customerId },
    });

    if (!customer?.uid) {
      await this.prisma.customer.create({
        data: { uid: customerId },
      });
    }

    const passcode = generateSixDigitNumber().toString();

    let startDate: Date;
    let endDate: Date;

    // If startTime or endTime are strings, convert them to Date objects
    if (typeof startTime === 'string') {
      startDate = new Date(startTime);
    }
    if (typeof endTime === 'string') {
      endDate = new Date(endTime);
    }

    const slot = await this.getFreeSlot({
      endTime: endDate,
      startTime: startDate,
      garageId,
      type,
    });

    if (!slot) {
      throw new NotFoundException('No slots found.');
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          endTime: new Date(endTime).toISOString(),
          startTime: new Date(startTime).toISOString(),
          vehicleNumber,
          customerId,
          phoneNumber,
          passcode,
          slotId: slot.id,
          pricePerHour,
          totalPrice,
          ...(valetAssignment
            ? { ValetAssignment: { create: valetAssignment } }
            : null),
        },
      });
      await tx.bookingTimeline.create({
        data: { bookingId: booking.id, status: 'BOOKED' },
      });

      return booking;
    });
  }

  getFreeSlot({
    garageId,
    startTime,
    endTime,
    type,
  }: {
    garageId: number;
    startTime: string | Date;
    endTime: string | Date;
    type: SlotType;
  }) {
    return this.prisma.slot.findFirst({
      where: {
        garageId: garageId,
        type: type,
        Bookings: {
          none: {
            OR: [
              { startTime: { lt: endTime }, endTime: { gt: startTime } },
              { startTime: { gt: startTime }, endTime: { lt: endTime } },
            ],
          },
        },
      },
    });
  }
}
