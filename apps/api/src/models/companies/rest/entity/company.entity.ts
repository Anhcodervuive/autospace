import { Company } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class CompanyEntity implements RestrictProperties<
  CompanyEntity,
  Company
> {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  displayName: string;
  description: string;
}
