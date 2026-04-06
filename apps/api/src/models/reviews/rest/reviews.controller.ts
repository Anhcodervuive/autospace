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
import { CreateReview } from './dtos/create.dto';
import { ReviewQueryDto } from './dtos/query.dto';
import { UpdateReview } from './dtos/update.dto';
import { ReviewEntity } from './entity/review.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReviewEntity })
  @Post()
  create(@Body() createReviewDto: CreateReview) {
    return this.prisma.review.create({ data: createReviewDto });
  }

  @ApiOkResponse({ type: [ReviewEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ReviewQueryDto) {
    return this.prisma.review.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: ReviewEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.review.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: ReviewEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReview) {
    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.review.delete({ where: { id } });
  }
}
