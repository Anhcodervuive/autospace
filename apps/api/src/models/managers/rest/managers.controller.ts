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
import { CreateManager } from './dtos/create.dto';
import { ManagerQueryDto } from './dtos/query.dto';
import { UpdateManager } from './dtos/update.dto';
import { ManagerEntity } from './entity/manager.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ManagerEntity })
  @Post()
  create(@Body() createManagerDto: CreateManager) {
    return this.prisma.manager.create({ data: createManagerDto });
  }

  @ApiOkResponse({ type: [ManagerEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ManagerQueryDto) {
    return this.prisma.manager.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: ManagerEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.manager.findUnique({ where: { uid } });
  }

  @ApiOkResponse({ type: ManagerEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateManagerDto: UpdateManager) {
    return this.prisma.manager.update({
      where: { uid },
      data: updateManagerDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.prisma.manager.delete({ where: { uid } });
  }
}
