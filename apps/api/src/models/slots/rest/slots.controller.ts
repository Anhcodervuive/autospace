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
import { SlotsService } from '../graphql/slots.service';
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
  constructor(private readonly slotsService: SlotsService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: SlotEntity })
  @Post()
  create(@Body() createSlotDto: CreateSlot) {
    return this.slotsService.create(createSlotDto);
  }

  @ApiOkResponse({ type: [SlotEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: SlotQueryDto) {
    return this.slotsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: SlotEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.slotsService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: SlotEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateSlotDto: UpdateSlot) {
    return this.slotsService.update({ id, ...updateSlotDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.slotsService.remove({ where: { id } });
  }
}
