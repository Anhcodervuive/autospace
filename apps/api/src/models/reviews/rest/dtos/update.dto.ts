import { PartialType } from '@nestjs/swagger';
import { CreateReview } from './create.dto';

export class UpdateReview extends PartialType(CreateReview) {}
