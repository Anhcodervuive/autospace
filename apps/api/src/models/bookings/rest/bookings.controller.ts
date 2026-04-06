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
import { CreateBooking } from './dtos/create.dto';
import { BookingQueryDto } from './dtos/query.dto';
import { UpdateBooking } from './dtos/update.dto';
import { BookingEntity } from './entity/booking.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingEntity })
  @Post()
  create(@Body() createBookingDto: CreateBooking) {
    return this.prisma.booking.create({ data: createBookingDto });
  }

  @ApiOkResponse({ type: [BookingEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingQueryDto) {
    return this.prisma.booking.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: BookingEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.booking.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: BookingEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBooking) {
    return this.prisma.booking.update({
      where: { id },
      data: updateBookingDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.booking.delete({ where: { id } });
  }
}
