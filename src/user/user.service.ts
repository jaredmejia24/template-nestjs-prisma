import { User } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserParamsDto, UserUpdateDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      where: { status: 'active' },
      select: {
        password: false,
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    return { status: 'success', data: { users } };
  }

  getUserInSession(user: User) {
    return { status: 'success', data: { user } };
  }

  async getUserById(params: UserParamsDto) {
    const { id } = params;
    const user = await this.userExist(id);

    delete user.password;

    return { status: 'success', data: { user } };
  }

  async updateUser(body: UserUpdateDto, params: UserParamsDto, req: Request) {
    const { id } = params;
    const user = await this.userExist(id);

    this.protectUserAccounts(id, req);

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { ...body },
    });

    delete updatedUser.password;

    return { status: 'success', data: { user: updatedUser } };
  }

  async deleteUser(params: UserParamsDto, req: Request) {
    const { id } = params;
    const user = await this.userExist(id);

    this.protectUserAccounts(id, req);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { status: 'disabled' },
    });

    return;
  }

  async userExist(id: number) {
    const user = await this.prisma.user.findFirst({
      where: { id, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  protectUserAccounts(id: number, req: Request) {
    const { user } = req;

    if (id !== user.id) {
      throw new ForbiddenException('You Are Not The Owner Of This Account');
    }
  }
}
