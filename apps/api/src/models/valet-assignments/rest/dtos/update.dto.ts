import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateValetAssignment } from './create.dto';

export class UpdateValetAssignment extends PartialType(
  OmitType(CreateValetAssignment, ['bookingId'] as const),
) {}
