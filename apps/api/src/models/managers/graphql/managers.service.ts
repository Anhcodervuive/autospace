import { Injectable } from '@nestjs/common';
import { FindManyManagerArgs, FindUniqueManagerArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateManagerInput } from './dtos/create-manager.input';
import { UpdateManagerInput } from './dtos/update-manager.input';

@Injectable()
export class ManagersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createManagerInput: CreateManagerInput) {
    return this.prisma.manager.create({
      data: createManagerInput,
    });
  }

  findAll(args: FindManyManagerArgs) {
    return this.prisma.manager.findMany(args);
  }

  findOne(args: FindUniqueManagerArgs) {
    return this.prisma.manager.findUnique(args);
  }

  update(updateManagerInput: UpdateManagerInput) {
    const { uid, ...data } = updateManagerInput;
    return this.prisma.manager.update({
      where: { uid },
      data: data,
    });
  }

  remove(args: FindUniqueManagerArgs) {
    return this.prisma.manager.delete(args);
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

  findBookingTimelinesByManagerUid(uid: string) {
    return this.prisma.bookingTimeline.findMany({
      where: { managerId: uid },
    });
  }
}
