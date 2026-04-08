import { Injectable } from '@nestjs/common';
import { FindManyValetArgs, FindUniqueValetArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateValetInput } from './dtos/create-valet.input';
import { UpdateValetInput } from './dtos/update-valet.input';

@Injectable()
export class ValetsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createValetInput: CreateValetInput) {
    return this.prisma.valet.create({
      data: createValetInput,
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
