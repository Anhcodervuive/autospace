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
import { CustomersService } from '../graphql/customers.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCustomer } from './dtos/create.dto';
import { CustomerQueryDto } from './dtos/query.dto';
import { UpdateCustomer } from './dtos/update.dto';
import { CustomerEntity } from './entity/customer.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CustomerEntity })
  @Post()
  create(@Body() createCustomerDto: CreateCustomer) {
    return this.customersService.create(createCustomerDto);
  }

  @ApiOkResponse({ type: [CustomerEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CustomerQueryDto) {
    return this.customersService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: CustomerEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.customersService.findOne({ where: { uid } });
  }

  @ApiOkResponse({ type: CustomerEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateCustomerDto: UpdateCustomer) {
    return this.customersService.update({ uid, ...updateCustomerDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.customersService.remove({ where: { uid } });
  }
}
