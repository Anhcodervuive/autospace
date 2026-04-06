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
import { CreateCustomer } from './dtos/create.dto';
import { CustomerQueryDto } from './dtos/query.dto';
import { UpdateCustomer } from './dtos/update.dto';
import { CustomerEntity } from './entity/customer.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CustomerEntity })
  @Post()
  create(@Body() createCustomerDto: CreateCustomer) {
    return this.prisma.customer.create({ data: createCustomerDto });
  }

  @ApiOkResponse({ type: [CustomerEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CustomerQueryDto) {
    return this.prisma.customer.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: CustomerEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.customer.findUnique({ where: { uid } });
  }

  @ApiOkResponse({ type: CustomerEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  update(@Param('uid') uid: string, @Body() updateCustomerDto: UpdateCustomer) {
    return this.prisma.customer.update({
      where: { uid },
      data: updateCustomerDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':uid')
  remove(@Param('uid') uid: string) {
    return this.prisma.customer.delete({ where: { uid } });
  }
}
