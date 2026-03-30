import {
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import type { Request } from 'express';
import type { GetUserType, Role } from 'src/common/types';

import { AuthGuard } from './auth.guard';
import { GqlExecutionContext } from '@nestjs/graphql';

type RequestWithUser = Request & { user?: GetUserType };

export const AllowAuthenticated = (...roles: Role[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(AuthGuard));

export const GetUser = createParamDecorator((_data, ctx: ExecutionContext) => {
  if (ctx.getType<'http' | 'graphql'>() === 'http') {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  }

  const context = GqlExecutionContext.create(ctx);
  const request = context.getContext<{ req: RequestWithUser }>().req;
  return request.user;
});
