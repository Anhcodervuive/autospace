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
import { ReviewsService } from '../graphql/reviews.service';
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
  constructor(private readonly reviewsService: ReviewsService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ReviewEntity })
  @Post()
  create(@Body() createReviewDto: CreateReview) {
    return this.reviewsService.create(createReviewDto);
  }

  @ApiOkResponse({ type: [ReviewEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ReviewQueryDto) {
    return this.reviewsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: ReviewEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reviewsService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: ReviewEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateReviewDto: UpdateReview) {
    return this.reviewsService.update({ id, ...updateReviewDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.reviewsService.remove({ where: { id } });
  }
}
