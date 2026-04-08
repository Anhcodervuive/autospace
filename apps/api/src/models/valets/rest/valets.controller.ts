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
import { ValetsService } from '../graphql/valets.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateValet } from './dtos/create.dto';
import { ValetQueryDto } from './dtos/query.dto';
import { UpdateValet } from './dtos/update.dto';
import { ValetEntity } from './entity/valet.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('valets')
@Controller('valets')
export class ValetsController {
  constructor(private readonly valetsService: ValetsService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ValetEntity })
  @Post()
  create(@Body() createValetDto: CreateValet) {
    return this.valetsService.create(createValetDto);
  }

  @ApiOkResponse({ type: [ValetEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetQueryDto) {
    return this.valetsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: ValetEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.valetsService.findOne({ where: { uid } });
  }

  @ApiOkResponse({ type: ValetEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateValetDto: UpdateValet) {
    return this.valetsService.update({ uid, ...updateValetDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.valetsService.remove({ where: { uid } });
  }
}
