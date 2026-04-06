import { Manager } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class ManagerEntity implements RestrictProperties<
  ManagerEntity,
  Manager
> {
  uid: string;
  displayName: string;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}
