import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { PrismaService } from 'src/common/prisma/prisma.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateVerification } from './dtos/create.dto';
import { VerificationQueryDto } from './dtos/query.dto';
import { UpdateVerification } from './dtos/update.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { VerificationEntity } from './entity/verification.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';
import { DeleteVerification } from './dtos/delete.dto';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: VerificationEntity })
  @Post()
  create(@Body() createVerificationDto: CreateVerification) {
    return this.prisma.verification.create({ data: createVerificationDto });
  }

  @ApiOkResponse({ type: [VerificationEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: VerificationQueryDto) {
    return this.prisma.verification.findMany({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    });
  }

  @ApiOkResponse({ type: VerificationEntity })
  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Patch(':id')
  async update(@Body() updateVerificationDto: UpdateVerification) {
    const { adminId, garageId } = updateVerificationDto;

    return this.prisma.verification.update({
      where: { adminId, garageId },
      data: updateVerificationDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Delete('')
  async remove(@Body() deleteVerificationDto: DeleteVerification) {
    return this.prisma.verification.delete({
      where: { ...deleteVerificationDto },
    });
  }
}
