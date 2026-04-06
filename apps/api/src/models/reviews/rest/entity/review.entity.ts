import { Review } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class ReviewEntity implements RestrictProperties<ReviewEntity, Review> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  comment: string;
  customerId: string;
  garageId: number;
}
