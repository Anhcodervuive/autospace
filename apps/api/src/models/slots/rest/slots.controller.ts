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
import { CreateSlot } from './dtos/create.dto';
import { SlotQueryDto } from './dtos/query.dto';
import { UpdateSlot } from './dtos/update.dto';
import { SlotEntity } from './entity/slot.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('slots')
@Controller('slots')
export class SlotsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SlotEntity })
  @Post()
  create(@Body() createSlotDto: CreateSlot) {
    return this.prisma.slot.create({ data: createSlotDto });
  }

  @ApiOkResponse({ type: [SlotEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: SlotQueryDto) {
    return this.prisma.slot.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: SlotEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.slot.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: SlotEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSlotDto: UpdateSlot) {
    return this.prisma.slot.update({
      where: { id },
      data: updateSlotDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.slot.delete({ where: { id } });
  }
}
