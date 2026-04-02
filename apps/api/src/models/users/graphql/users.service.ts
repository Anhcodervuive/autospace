import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FindManyUserArgs } from './dtos/find.args';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserInput } from './dtos/update-user.input';
import {
  LoginInput,
  RegisterUserWithCredentialInput,
  RegisterUserWithProviderInput,
} from './dtos/create-user.input';
import bcrypt from 'node_modules/bcryptjs';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  registerWithProvider({
    image,
    name,
    uid,
    type,
  }: RegisterUserWithProviderInput) {
    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        AuthProvider: {
          create: {
            type,
          },
        },
      },
    });
  }

  async registerWithCredentials({
    email,
    name,
    password,
    image,
  }: RegisterUserWithCredentialInput) {
    const existingUser = await this.prisma.credentials.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists with this email.');
    }

    // Hash the password
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);

    const uid = uuid();

    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        Credentials: {
          create: {
            email,
            passwordHash,
          },
        },
        AuthProvider: {
          create: {
            type: 'CREDENTIALS',
          },
        },
      },
      include: {
        Credentials: true,
      },
    });
  }

  async login({ email, password }: LoginInput) {
    const user = await this.prisma.user.findFirst({
      where: {
        Credentials: { email },
      },
      include: {
        Credentials: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      user.Credentials?.passwordHash as string,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const jwtToken = this.jwtService.sign(
      { uid: user.uid },
      {
        algorithm: 'HS256',
      },
    );

    return { token: jwtToken };
  }

  findAll(args: FindManyUserArgs) {
    return this.prisma.user.findMany(args);
  }

  findOne(uid: string) {
    return this.prisma.user.findUnique({ where: { uid } });
  }

  update(updateUserInput: UpdateUserInput) {
    const { uid, ...data } = updateUserInput;
    return this.prisma.user.update({
      where: { uid },
      data,
    });
  }

  remove(uid: string) {
    return this.prisma.user.delete({ where: { uid } });
  }
}
