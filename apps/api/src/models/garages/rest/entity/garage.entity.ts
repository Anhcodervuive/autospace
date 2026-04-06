import { Garage } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class GarageEntity implements RestrictProperties<GarageEntity, Garage> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  description: string;
  images: string[];
  companyId: number;
}
