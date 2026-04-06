import { CreateManagerInput } from './create-manager.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { Manager } from '@prisma/client';

@InputType()
export class UpdateManagerInput extends PartialType(CreateManagerInput) {
  @Field(() => ID)
  uid: Manager['uid'];
}
