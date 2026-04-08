import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValetAssignmentsService } from '../graphql/valet-assignments.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateValetAssignment } from './dtos/create.dto';
import { ValetAssignmentQueryDto } from './dtos/query.dto';
import { UpdateValetAssignment } from './dtos/update.dto';
import { ValetAssignmentEntity } from './entity/valet-assignment.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('valet-assignments')
@Controller('valet-assignments')
export class ValetAssignmentsController {
  constructor(
    private readonly valetAssignmentsService: ValetAssignmentsService,
  ) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: ValetAssignmentEntity })
  @Post()
  create(@Body() createValetAssignmentDto: CreateValetAssignment) {
    return this.valetAssignmentsService.create(createValetAssignmentDto);
  }

  @ApiOkResponse({ type: [ValetAssignmentEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: ValetAssignmentQueryDto) {
    return this.valetAssignmentsService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: ValetAssignmentEntity })
  @Get(':bookingId')
  findOne(@Param('bookingId') bookingId: number) {
    return this.valetAssignmentsService.findOne({ where: { bookingId } });
  }

  @ApiOkResponse({ type: ValetAssignmentEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':bookingId')
  update(
    @Param('bookingId') bookingId: number,
    @Body() updateValetAssignmentDto: UpdateValetAssignment,
  ) {
    return this.valetAssignmentsService.update({
      bookingId,
      ...updateValetAssignmentDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':bookingId')
  remove(@Param('bookingId') bookingId: number) {
    return this.valetAssignmentsService.remove({ where: { bookingId } });
  }
}
