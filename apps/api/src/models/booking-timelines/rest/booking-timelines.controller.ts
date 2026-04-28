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
import { BookingTimelinesService } from '../graphql/booking-timelines.service';
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
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import type { GetUserType } from 'src/common/types';

@ApiTags('booking-timelines')
@Controller('booking-timelines')
export class BookingTimelinesController {
  constructor(
    private readonly bookingTimelinesService: BookingTimelinesService,
  ) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: BookingTimelineEntity })
  @Post()
  create(
    @Body() createBookingTimelineDto: CreateBookingTimeline,
    @GetUser() user: GetUserType,
  ) {
    return this.bookingTimelinesService.create(createBookingTimelineDto, user);
  }

  @ApiOkResponse({ type: [BookingTimelineEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: BookingTimelineQueryDto) {
    return this.bookingTimelinesService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: BookingTimelineEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookingTimelinesService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: BookingTimelineEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBookingTimelineDto: UpdateBookingTimeline,
  ) {
    return this.bookingTimelinesService.update({
      id,
      ...updateBookingTimelineDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.bookingTimelinesService.remove({ where: { id } });
  }
}
