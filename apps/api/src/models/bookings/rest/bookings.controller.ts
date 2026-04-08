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
import { BookingsService } from '../graphql/bookings.service';
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
  constructor(private readonly bookingsService: BookingsService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingEntity })
  @Post()
  create(@Body() createBookingDto: CreateBooking) {
    return this.bookingsService.create(createBookingDto as any);
  }

  @ApiOkResponse({ type: [BookingEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingQueryDto) {
    return this.bookingsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: BookingEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookingsService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: BookingEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBooking) {
    return this.bookingsService.update({ id, ...updateBookingDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingsService.remove({ where: { id } });
  }
}
