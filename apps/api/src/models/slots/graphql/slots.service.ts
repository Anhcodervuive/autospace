import { Injectable } from '@nestjs/common';
import { FindManySlotArgs, FindUniqueSlotArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateSlotInput } from './dtos/create-slot.input';
import { UpdateSlotInput } from './dtos/update-slot.input';
import { checkRowLevelPermission } from 'src/common/auth/util';
import { GetUserType } from 'src/common/types';

@Injectable()
export class SlotsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createSlotInput: CreateSlotInput) {
    return this.prisma.slot.create({
      data: createSlotInput,
    });
  }

  async createMany(
    payload: CreateSlotInput,
    user: GetUserType,
    quantity: number,
  ) {
    const garage = await this.prisma.garage.findUnique({
      where: { id: payload.garageId },
      include: {
        Company: {
          include: { Managers: true },
        },
      },
    });

    checkRowLevelPermission({
      user,
      requestedUid: garage.Company.Managers.map((manager) => manager.uid),
    });

    const typeCount = await this.prisma.slot.count({
      where: { garageId: payload.garageId, type: payload.type },
    });

    const slots = Array.from({ length: quantity }).map((num, index) => ({
      ...payload,
      displayName: `${payload.type} ${typeCount + index + 1}`,
    }));

    return this.prisma.slot.createMany({ data: slots });
  }

  findAll(args: FindManySlotArgs) {
    return this.prisma.slot.findMany(args);
  }

  findOne(args: FindUniqueSlotArgs) {
    return this.prisma.slot.findUnique(args);
  }

  update(updateSlotInput: UpdateSlotInput) {
    const { id, ...data } = updateSlotInput;
    return this.prisma.slot.update({
      where: { id },
      data: data,
    });
  }

  remove(args: FindUniqueSlotArgs) {
    return this.prisma.slot.delete(args);
  }

  findGarageById(id: number) {
    return this.prisma.garage.findUnique({
      where: { id },
    });
  }

  findBookingsBySlotId(slotId: number) {
    return this.prisma.booking.findMany({
      where: { slotId },
    });
  }
}
