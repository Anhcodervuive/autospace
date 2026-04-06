import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUser } from './dtos/create.dto';
import { UserQueryDto } from './dtos/query.dto';
import { UpdateUser } from './dtos/update.dto';
import { UserEntity } from './entity/user.entity';
import { AllowAuthenticated, GetUser } from 'src/common/auth/auth.decorator';
import type { GetUserType } from 'src/common/types';
import { checkRowLevelPermission } from 'src/common/auth/util';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  create(@Body() createUserDto: CreateUser, @GetUser() authUser: GetUserType) {
    checkRowLevelPermission({
      user: authUser,
      requestedUid: createUserDto.uid,
    });
    return this.prisma.user.create({ data: createUserDto });
  }

  @ApiOkResponse({ type: [UserEntity] })
  @Get()
  findAll(
    @Query() { skip, take, order, sortBy, search, searchBy }: UserQueryDto,
  ) {
    return this.prisma.user.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
      ...(searchBy
        ? { where: { [searchBy]: { contains: search, mode: 'insensitive' } } }
        : null),
    });
  }

  @ApiOkResponse({ type: UserEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.prisma.user.findUnique({ where: { uid } });
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':uid')
  async update(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUser,
    @GetUser() authUser: GetUserType,
  ) {
    const targetUser = await this.prisma.user.findUnique({ where: { uid } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
    return this.prisma.user.update({
      where: { uid },
      data: updateUserDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() authUser: GetUserType) {
    const targetUser = await this.prisma.user.findUnique({ where: { uid } });
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
    return this.prisma.user.delete({ where: { uid } });
  }
}
