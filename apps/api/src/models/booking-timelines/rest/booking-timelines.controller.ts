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
import { CreateBookingTimeline } from './dtos/create.dto';
import { BookingTimelineQueryDto } from './dtos/query.dto';
import { UpdateBookingTimeline } from './dtos/update.dto';
import { BookingTimelineEntity } from './entity/booking-timeline.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('booking-timelines')
@Controller('booking-timelines')
export class BookingTimelinesController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingTimelineEntity })
  @Post()
  create(@Body() createBookingTimelineDto: CreateBookingTimeline) {
    return this.prisma.bookingTimeline.create({
      data: createBookingTimelineDto,
    });
  }

  @ApiOkResponse({ type: [BookingTimelineEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingTimelineQueryDto) {
    return this.prisma.bookingTimeline.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: BookingTimelineEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.bookingTimeline.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: BookingTimelineEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBookingTimelineDto: UpdateBookingTimeline,
  ) {
    return this.prisma.bookingTimeline.update({
      where: { id },
      data: updateBookingTimelineDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.bookingTimeline.delete({ where: { id } });
  }
}
