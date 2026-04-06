import { Customer } from '@prisma/client';
import { RestrictProperties } from 'src/common/dtos/common.input';

export class CustomerEntity implements RestrictProperties<
  CustomerEntity,
  Customer
> {
  uid: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}
