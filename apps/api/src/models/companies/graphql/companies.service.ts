import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyCompanyArgs, FindUniqueCompanyArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCompanyInput } from './dtos/create-company.input';
import { UpdateCompanyInput } from './dtos/update-company.input';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}
  async create({ description, displayName, managerId }: CreateCompanyInput) {
    const manager = await this.prisma.manager.findUnique({
      where: { uid: managerId },
    });

    if (manager) {
      throw new BadRequestException('Manager is already assigned to a company');
    }
    return this.prisma.company.create({
      data: {
        description,
        displayName,
        Managers: {
          connect: {
            uid: managerId,
          },
        },
      },
    });
  }

  findAll(args: FindManyCompanyArgs) {
    return this.prisma.company.findMany(args);
  }

  createFromRest({
    displayName,
    description,
  }: {
    displayName: string;
    description: string;
  }) {
    return this.prisma.company.create({
      data: {
        displayName,
        description,
      },
    });
  }

  findOne(args: FindUniqueCompanyArgs) {
    return this.prisma.company.findUnique(args);
  }

  update(updateCompanyInput: UpdateCompanyInput) {
    const { id, ...data } = updateCompanyInput;
    return this.prisma.company.update({
      where: { id },
      data: data,
    });
  }

  remove(args: FindUniqueCompanyArgs) {
    return this.prisma.company.delete(args);
  }

  findOneWithManagers(id: number) {
    return this.prisma.company.findUnique({
      where: { id },
      include: {
        Managers: {
          select: {
            uid: true,
          },
        },
      },
    });
  }

  findGaragesByCompanyId(companyId: number) {
    return this.prisma.garage.findMany({
      where: { companyId },
    });
  }

  findManagersByCompanyId(companyId: number) {
    return this.prisma.manager.findMany({
      where: { companyId },
    });
  }

  findValetsByCompanyId(companyId: number) {
    return this.prisma.valet.findMany({
      where: { companyId },
    });
  }
}
