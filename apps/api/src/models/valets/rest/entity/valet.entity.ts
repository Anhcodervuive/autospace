import { Valet } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class ValetEntity implements RestrictProperties<ValetEntity, Valet> {
  uid: string;
  displayName: string;
  image: string;
  licenceId: string;
  companyId: number;
  createdAt: Date;
  updatedAt: Date;
}
