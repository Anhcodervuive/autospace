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
import { CreateValet } from './dtos/create.dto';
import { ValetQueryDto } from './dtos/query.dto';
import { UpdateValet } from './dtos/update.dto';
import { ValetEntity } from './entity/valet.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('valets')
@Controller('valets')
export class ValetsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ValetEntity })
  @Post()
  create(@Body() createValetDto: CreateValet) {
    return this.prisma.valet.create({ data: createValetDto });
  }

  @ApiOkResponse({ type: [ValetEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetQueryDto) {
    return this.prisma.valet.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: ValetEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.valet.findUnique({ where: { uid } });
  }

  @ApiOkResponse({ type: ValetEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateValetDto: UpdateValet) {
    return this.prisma.valet.update({
      where: { uid },
      data: updateValetDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.prisma.valet.delete({ where: { uid } });
  }
}
