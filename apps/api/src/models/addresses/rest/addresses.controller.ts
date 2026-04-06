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
import { CreateAddress } from './dtos/create.dto';
import { AddressQueryDto } from './dtos/query.dto';
import { UpdateAddress } from './dtos/update.dto';
import { AddressEntity } from './entity/address.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('addresses')
@Controller('addresses')
export class AddressesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AddressEntity })
  @Post()
  create(@Body() createAddressDto: CreateAddress) {
    return this.prisma.address.create({ data: createAddressDto });
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: AddressQueryDto) {
    return this.prisma.address.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: AddressEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.address.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: AddressEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAddressDto: UpdateAddress) {
    return this.prisma.address.update({
      where: { id },
      data: updateAddressDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.address.delete({ where: { id } });
  }
}
