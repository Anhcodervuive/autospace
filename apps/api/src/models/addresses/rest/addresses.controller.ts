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
import { AddressesService } from '../graphql/addresses.service';
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
  constructor(private readonly addressesService: AddressesService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: AddressEntity })
  @Post()
  create(@Body() createAddressDto: CreateAddress) {
    return this.addressesService.create(createAddressDto as any);
  }

  @ApiOkResponse({ type: [AddressEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: AddressQueryDto) {
    return this.addressesService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: AddressEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.addressesService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: AddressEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAddressDto: UpdateAddress) {
    return this.addressesService.update({ id, ...updateAddressDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.addressesService.remove({ where: { id } });
  }
}
