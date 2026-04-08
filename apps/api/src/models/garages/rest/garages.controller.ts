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
import { GaragesService } from '../graphql/garages.service';
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
  constructor(private readonly garagesService: GaragesService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: GarageEntity })
  @Post()
  create(@Body() createGarageDto: CreateGarage) {
    return this.garagesService.create(createGarageDto as any);
  }

  @ApiOkResponse({ type: [GarageEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: GarageQueryDto) {
    return this.garagesService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: GarageEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.garagesService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: GarageEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateGarageDto: UpdateGarage) {
    return this.garagesService.update({ id, ...updateGarageDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.garagesService.remove({ where: { id } });
  }
}
