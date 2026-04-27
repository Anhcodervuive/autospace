import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyGarageArgs, FindUniqueGarageArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateGarageInput } from './dtos/create-garage.input';
import { UpdateGarageInput } from './dtos/update-garage.input';
import { SlotWhereInput } from 'src/models/slots/graphql/dtos/where.args';
import { GarageFilter } from './dtos/search-filter.input';
import { DateFilterInput } from './dtos/search-filter.input';
import { LocationFilterInput } from 'src/common/dtos/common.input';
import { Garage } from './entity/garage.entity';
import { GarageWhereInput } from './dtos/where.args';
import { GetUserType } from 'src/common/types';
import { CreateSlotInputWithoutGarageId } from 'src/models/slots/graphql/dtos/create-slot.input';
import { Prisma } from '@prisma/client';

@Injectable()
export class GaragesService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createGarageInput: CreateGarageInput, user: GetUserType) {
    const { address, description, displayName, images, slot } =
      createGarageInput;
    const company = await this.prisma.company.findFirst({
      where: {
        Managers: {
          some: {
            uid: user.uid,
          },
        },
      },
    });
    if (!company?.id) {
      throw new BadRequestException(
        'No company associated with the manager id.',
      );
    }

    if (slot.some((slot) => slot.count > 10)) {
      throw new Error('Slot count cannot greater than 10');
    }

    return this.prisma.$transaction(async (tx) => {
      const createdGarage = await tx.garage.create({
        data: {
          Address: { create: address },
          companyId: company.id,
          description,
          displayName,
          images,
        },
      });
      const slotsByType = this.groupSlotsByType(slot, createdGarage.id);

      await tx.slot.createMany({
        data: slotsByType,
      });

      return createdGarage;
    });
  }

  findAll(args: FindManyGarageArgs) {
    return this.prisma.garage.findMany(args);
  }

  findOne(args: FindUniqueGarageArgs) {
    return this.prisma.garage.findUnique(args);
  }

  searchGarages(
    slotFilter: SlotWhereInput,
    dateFilter: DateFilterInput,
    locationFilter: LocationFilterInput,
    args: GarageFilter,
  ) {
    const { ne_lat, ne_lng, sw_lat, sw_lng } = locationFilter;
    const { start, end } = dateFilter;
    let startDate = new Date(start);
    let endDate = new Date(end);

    const currentDate = new Date();

    const diffInSeconds = Math.floor(
      (endDate.getTime() - startDate.getTime()) / 1000,
    );

    if (startDate.getTime() < currentDate.getTime()) {
      startDate = currentDate;
      const updatedEndDate = new Date(startDate);
      updatedEndDate.setSeconds(updatedEndDate.getSeconds() + diffInSeconds);
      endDate = updatedEndDate;
    }

    if (startDate.getTime() >= endDate.getTime()) {
      throw new BadRequestException(
        'Invalid date range: start date must be before end date.',
      );
    }

    const { where = {}, ...garageFilter } = args || {};

    return this.prisma.garage.findMany({
      ...garageFilter,
      where: {
        ...where,
        Address: {
          lat: { lte: ne_lat, gte: sw_lat },
          lng: { lte: ne_lng, gte: sw_lng },
        },
        Slots: {
          some: {
            ...slotFilter,
            Bookings: {
              none: {
                OR: [
                  {
                    startTime: { lt: endDate },
                    endTime: { gt: startDate },
                  },
                  {
                    startTime: { gt: startDate },
                    endTime: { lt: endDate },
                  },
                ],
              },
            },
          },
        },
      },
    });
  }

  async getAvailableSlots(
    garage: Garage,
    dateFilter: DateFilterInput,
    slotsFilter: SlotWhereInput,
  ) {
    const { start, end } = dateFilter;
    const startDate = new Date(start);
    const endDate = new Date(end);

    const groupBySlots = await this.prisma.slot.groupBy({
      by: ['type'],
      _count: { type: true },
      _min: { pricePerHour: true },
      where: {
        ...slotsFilter,
        garageId: { equals: garage.id },
        Bookings: {
          none: {
            OR: [
              {
                startTime: { lt: endDate },
                endTime: { gt: startDate },
              },
              {
                startTime: { gt: startDate },
                endTime: { lt: endDate },
              },
            ],
          },
        },
      },
    });

    return groupBySlots.map(({ _count, type, _min }) => ({
      type,
      count: _count.type,
      pricePerHour: _min.pricePerHour,
    }));
  }

  async getSlotCounts(garageId: number) {
    const slotCounts = await this.prisma.slot.groupBy({
      by: ['type'],
      where: {
        garageId,
      },
      _count: {
        type: true,
      },
    });

    return slotCounts.map(({ type, _count }) => ({
      type,
      count: _count.type,
    }));
  }

  async getGaragesCount(where: GarageWhereInput) {
    const garages = await this.prisma.garage.aggregate({
      _count: { _all: true },
      where,
    });
    return { count: garages._count._all };
  }

  update(updateGarageInput: UpdateGarageInput) {
    const { id, ...data } = updateGarageInput;
    return this.prisma.garage.update({
      where: { id },
      data: data,
    });
  }

  remove(args: FindUniqueGarageArgs) {
    return this.prisma.garage.delete(args);
  }

  findCompanyById(id: number) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  findAddressByGarageId(garageId: number) {
    return this.prisma.address.findUnique({
      where: { garageId },
    });
  }

  findVerificationByGarageId(garageId: number) {
    return this.prisma.verification.findUnique({
      where: { garageId },
    });
  }

  findReviewsByGarageId(garageId: number) {
    return this.prisma.review.findMany({
      where: { garageId },
    });
  }

  findSlotsByGarageId(garageId: number) {
    return this.prisma.slot.findMany({
      where: { garageId },
    });
  }

  groupSlotsByType(
    slots: CreateSlotInputWithoutGarageId[],
    garageId: number,
  ): Prisma.SlotCreateManyInput[] {
    const slotsByType: Prisma.SlotCreateManyInput[] = [];
    const slotCounts = {
      CAR: 0,
      HEAVY: 0,
      BIKE: 0,
      BICYCLE: 0,
    };

    slots.forEach(({ count, ...slot }) => {
      for (let i = 0; i < count; i++) {
        slotsByType.push({
          ...slot,
          displayName: `${slot.type} ${slotCounts[slot.type]}`,
          garageId,
        });
        slotCounts[slot.type]++;
      }
    });

    return slotsByType;
  }
}
