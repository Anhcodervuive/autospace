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
import { ManagersService } from '../graphql/managers.service';
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
  constructor(private readonly managersService: ManagersService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ManagerEntity })
  @Post()
  create(@Body() createManagerDto: CreateManager) {
    return this.managersService.create(createManagerDto);
  }

  @ApiOkResponse({ type: [ManagerEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ManagerQueryDto) {
    return this.managersService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: ManagerEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.managersService.findOne({ where: { uid } });
  }

  @ApiOkResponse({ type: ManagerEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateManagerDto: UpdateManager) {
    return this.managersService.update({ uid, ...updateManagerDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.managersService.remove({ where: { uid } });
  }
}
