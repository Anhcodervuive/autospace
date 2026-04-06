import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateValetAssignment } from './dtos/create.dto';
import { ValetAssignmentQueryDto } from './dtos/query.dto';
import { UpdateValetAssignment } from './dtos/update.dto';
import { ValetAssignmentEntity } from './entity/valet-assignment.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('valet-assignments')
@Controller('valet-assignments')
export class ValetAssignmentsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ValetAssignmentEntity })
  @Post()
  create(@Body() createValetAssignmentDto: CreateValetAssignment) {
    return this.prisma.valetAssignment.create({
      data: createValetAssignmentDto,
    });
  }

  @ApiOkResponse({ type: [ValetAssignmentEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetAssignmentQueryDto) {
    return this.prisma.valetAssignment.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: ValetAssignmentEntity })
  @Get(':bookingId')
  findOne(@Param('bookingId') bookingId: number) {
    return this.prisma.valetAssignment.findUnique({ where: { bookingId } });
  }

  @ApiOkResponse({ type: ValetAssignmentEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':bookingId')
  update(
    @Param('bookingId') bookingId: number,
    @Body() updateValetAssignmentDto: UpdateValetAssignment,
  ) {
    return this.prisma.valetAssignment.update({
      where: { bookingId },
      data: updateValetAssignmentDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':bookingId')
  remove(@Param('bookingId') bookingId: number) {
    return this.prisma.valetAssignment.delete({ where: { bookingId } });
  }
}
