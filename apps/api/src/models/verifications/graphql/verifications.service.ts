import { Injectable } from '@nestjs/common';
import {
  FindManyVerificationArgs,
  FindUniqueVerificationArgs,
} from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateVerificationInput } from './dtos/create-verification.input';
import { UpdateVerificationInput } from './dtos/update-verification.input';

@Injectable()
export class VerificationsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createVerificationInput: CreateVerificationInput) {
    return this.prisma.verification.create({
      data: createVerificationInput,
    });
  }

  findAll(args: FindManyVerificationArgs) {
    return this.prisma.verification.findMany(args);
  }

  findOne(args: FindUniqueVerificationArgs) {
    return this.prisma.verification.findUnique(args);
  }

  update(updateVerificationInput: UpdateVerificationInput) {
    const { adminId, garageId, ...data } = updateVerificationInput;
    return this.prisma.verification.update({
      where: { adminId, garageId },
      data: data,
    });
  }

  remove(args: FindUniqueVerificationArgs) {
    return this.prisma.verification.delete(args);
  }

  findAdminByUid(uid: string) {
    return this.prisma.admin.findUnique({
      where: { uid },
    });
  }

  findGarageById(id: number) {
    return this.prisma.garage.findUnique({
      where: { id },
    });
  }
}
