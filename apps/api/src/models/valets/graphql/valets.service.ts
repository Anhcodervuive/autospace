import { Injectable } from '@nestjs/common';
import { FindManyValetArgs, FindUniqueValetArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateValetInput } from './dtos/create-valet.input';
import { UpdateValetInput } from './dtos/update-valet.input';
import type { GetUserType } from 'src/common/types';
import { checkRowLevelPermission } from 'src/common/auth/util';
import { ValetWhereInput } from './dtos/where.args';
import { PaginationInput } from 'src/common/dtos/common.input';

@Injectable()
export class ValetsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createValetInput: CreateValetInput, user: GetUserType) {
    const company = await this.prisma.company.findFirst({
      where: { Managers: { some: { uid: user.uid } } },
      include: {
        Managers: true,
      },
    });

    checkRowLevelPermission({
      user,
      requestedUid: company.Managers.map((manager) => manager.uid),
    });
    return this.prisma.valet.create({
      data: {
        ...createValetInput,
        companyId: company.id,
      },
    });
  }

  async getCompanyValetsTotal(where: ValetWhereInput, user: GetUserType) {
    const company = await this.prisma.company.findFirst({
      where: {
        Managers: {
          some: {
            uid: user.uid,
          },
        },
      },
    });

    return this.prisma.valet.count({
      where: {
        ...where,
        companyId: {
          equals: company.id,
        },
      },
    });
  }

  async valetPickups(pagination: PaginationInput, user: GetUserType) {
    const valet = await this.prisma.valet.findUnique({
      where: {
        uid: user.uid,
      },
    });
    return this.prisma.booking.findMany({
      ...pagination,
      where: {
        Slot: { Garage: { companyId: valet.companyId } },
        ValetAssignment: {
          pickupLat: { not: undefined },
          pickupValetId: null,
        },
      },
    });
  }

  async getValetPickupsTotal(user: GetUserType) {
    const valet = await this.prisma.valet.findUnique({
      where: {
        uid: user.uid,
      },
    });
    return this.prisma.booking.count({
      where: {
        Slot: { Garage: { companyId: valet.companyId } },
        ValetAssignment: {
          pickupLat: { not: undefined },
          pickupValetId: null,
        },
      },
    });
  }

  async valetDrops(pagination: PaginationInput, user: GetUserType) {
    const valet = await this.prisma.valet.findUnique({
      where: {
        uid: user.uid,
      },
    });
    return this.prisma.booking.findMany({
      ...pagination,
      where: {
        Slot: { Garage: { companyId: valet.companyId } },
        ValetAssignment: {
          returnLat: { not: null },
          returnValetId: null,
        },
      },
    });
  }

  async getValetDropsTotal(user: GetUserType) {
    const valet = await this.prisma.valet.findUnique({
      where: {
        uid: user.uid,
      },
    });
    return this.prisma.booking.count({
      where: {
        Slot: { Garage: { companyId: valet.companyId } },
        ValetAssignment: {
          returnLat: { not: null },
          returnValetId: null,
        },
      },
    });
  }

  findAll(args: FindManyValetArgs) {
    return this.prisma.valet.findMany(args);
  }

  findOne(args: FindUniqueValetArgs) {
    return this.prisma.valet.findUnique(args);
  }

  update(updateValetInput: UpdateValetInput) {
    const { uid, ...data } = updateValetInput;
    return this.prisma.valet.update({
      where: { uid },
      data: data,
    });
  }

  remove(args: FindUniqueValetArgs) {
    return this.prisma.valet.delete(args);
  }

  findUserByUid(uid: string) {
    return this.prisma.user.findUnique({
      where: { uid },
    });
  }

  findCompanyById(id: number) {
    return this.prisma.company.findUnique({
      where: { id },
    });
  }

  findBookingTimelinesByValetUid(uid: string) {
    return this.prisma.bookingTimeline.findMany({
      where: { valetId: uid },
    });
  }

  findPickupAssignmentsByValetUid(uid: string) {
    return this.prisma.valetAssignment.findMany({
      where: { pickupValetId: uid },
    });
  }

  findReturnAssignmentsByValetUid(uid: string) {
    return this.prisma.valetAssignment.findMany({
      where: { returnValetId: uid },
    });
  }
}
