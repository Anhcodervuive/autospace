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
import { CreateGarage } from './dtos/create.dto';
import { GarageQueryDto } from './dtos/query.dto';
import { UpdateGarage } from './dtos/update.dto';
import { GarageEntity } from './entity/garage.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('garages')
@Controller('garages')
export class GaragesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GarageEntity })
  @Post()
  create(@Body() createGarageDto: CreateGarage) {
    return this.prisma.garage.create({ data: createGarageDto });
  }

  @ApiOkResponse({ type: [GarageEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: GarageQueryDto) {
    return this.prisma.garage.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: GarageEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.garage.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: GarageEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGarageDto: UpdateGarage) {
    return this.prisma.garage.update({
      where: { id },
      data: updateGarageDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.garage.delete({ where: { id } });
  }
}
