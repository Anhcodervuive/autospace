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

@Injectable()
export class GaragesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createGarageInput: CreateGarageInput) {
    return this.prisma.garage.create({
      data: createGarageInput,
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
}
