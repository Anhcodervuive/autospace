import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Role } from 'src/common/types';
import { PrismaService } from 'src/common/prisma/prisma.service';

type JwtPayload = {
  uid: string;
  roles?: Role[];
};

type RequestWithUser = Request & {
  user?: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);

    await this.authenticateUser(req);

    return this.authorizeUser(req, context);
  }

  private getRequest(context: ExecutionContext): RequestWithUser {
    if (context.getType<'http' | 'graphql'>() === 'http') {
      return context.switchToHttp().getRequest<RequestWithUser>();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: RequestWithUser }>().req;
  }

  private async authenticateUser(req: RequestWithUser): Promise<void> {
    const beraerHeader = req.headers.authorization;
    const token = beraerHeader?.split(' ')[1];

    // Bearer eylskfdjlsdf309

    if (!token) {
      throw new UnauthorizedException('No token provided.');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (!payload) {
        throw new UnauthorizedException('Invalid token');
      }
      req.user = payload;
    } catch (err) {
      console.error('Token validation error:', err);
    }

    if (!req.user) {
      throw new UnauthorizedException('Invalid token.');
    }
  }

  private async authorizeUser(
    req: RequestWithUser,
    context: ExecutionContext,
  ): Promise<boolean> {
    const uid = req.user?.uid;
    if (!uid) {
      throw new UnauthorizedException('Invalid token.');
    }

    const userRoles = await this.getUserRoles(uid);
    req.user ??= { uid };
    req.user.roles = userRoles;

    const requiredRoles = this.getMetadata<Role[]>('roles', context);
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    return requiredRoles.some((role) => userRoles.includes(role));
  }

  private getMetadata<T>(key: string, context: ExecutionContext): T {
    return this.reflector.getAllAndOverride<T>(key, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async getUserRoles(uid: string): Promise<Role[]> {
    const rolePromises = [
      this.prisma.admin.findUnique({ where: { uid } }),
      // Add promises for other role models here
    ];

    const roles: Role[] = [];

    const [admin] = await Promise.all(rolePromises);
    if (admin) {
      roles.push('admin');
    }

    return roles;
  }
}
