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
import { AdminsService } from '../graphql/admins.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateAdmin } from './dtos/create.dto';
import { AdminQueryDto } from './dtos/query.dto';
import { UpdateAdmin } from './dtos/update.dto';
import { AdminEntity } from './entity/admin.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('admins')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AdminEntity })
  @Post()
  create(@Body() createAdminDto: CreateAdmin) {
    return this.adminsService.create(createAdminDto);
  }

  @ApiOkResponse({ type: [AdminEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: AdminQueryDto) {
    return this.adminsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: AdminEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.adminsService.findOne({ where: { uid } });
  }

  @ApiOkResponse({ type: AdminEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateAdminDto: UpdateAdmin) {
    return this.adminsService.update({ uid, ...updateAdminDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.adminsService.remove({ where: { uid } });
  }
}
