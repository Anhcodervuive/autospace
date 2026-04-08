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
import { UsersService } from '../graphql/users.service';
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
  constructor(private readonly usersService: UsersService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: UserEntity })
  @Post()
  create(@Body() createUserDto: CreateUser, @GetUser() authUser: GetUserType) {
    checkRowLevelPermission({
      user: authUser,
      requestedUid: createUserDto.uid,
    });
    return this.usersService.createFromRest(createUserDto);
  }

  @ApiOkResponse({ type: [UserEntity] })
  @Get()
  findAll(
    @Query() { skip, take, order, sortBy, search, searchBy }: UserQueryDto,
  ) {
    return this.usersService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
      ...(searchBy
        ? { where: { [searchBy]: { contains: search, mode: 'insensitive' } } }
        : null),
    } as any);
  }

  @ApiOkResponse({ type: UserEntity })
  @Get(':uid')
  findOne(@Param('uid') uid: string) {
    return this.usersService.findOne(uid);
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
    const targetUser = await this.usersService.findOne(uid);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
    return this.usersService.update({ uid, ...updateUserDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated('admin')
  @Delete(':uid')
  async remove(@Param('uid') uid: string, @GetUser() authUser: GetUserType) {
    const targetUser = await this.usersService.findOne(uid);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    checkRowLevelPermission({ user: authUser, requestedUid: targetUser.uid });
    return this.usersService.remove(uid);
  }
}
