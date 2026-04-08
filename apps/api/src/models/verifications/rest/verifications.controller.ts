import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';

import { VerificationsService } from '../graphql/verifications.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateVerification } from './dtos/create.dto';
import { VerificationQueryDto } from './dtos/query.dto';
import { UpdateVerification } from './dtos/update.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { VerificationEntity } from './entity/verification.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';
import { DeleteVerification } from './dtos/delete.dto';

@ApiTags('verifications')
@Controller('verifications')
export class VerificationsController {
  constructor(private readonly verificationsService: VerificationsService) {}

  @AllowAuthenticated('admin')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: VerificationEntity })
  @Post()
  create(@Body() createVerificationDto: CreateVerification) {
    return this.verificationsService.create(createVerificationDto);
  }

  @ApiOkResponse({ type: [VerificationEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: VerificationQueryDto) {
    return this.verificationsService.findAll({
      ...(skip ? { skip: +skip } : null),
      ...(take ? { take: +take } : null),
      ...(sortBy ? { orderBy: { [sortBy]: order || 'asc' } } : null),
    } as any);
  }

  @ApiOkResponse({ type: VerificationEntity })
  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Patch(':id')
  async update(@Body() updateVerificationDto: UpdateVerification) {
    return this.verificationsService.update(updateVerificationDto);
  }

  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Delete('')
  async remove(@Body() deleteVerificationDto: DeleteVerification) {
    return this.verificationsService.remove({
      where: { ...deleteVerificationDto },
    });
  }
}
