import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserParamsDto } from './dto';

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

  async userExist(dto: UserParamsDto) {
    const { id } = dto;

    const user = await this.prisma.user.findFirst({
      where: { id, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    return user;
  }

  async getUserById(dto: UserParamsDto) {
    const user = await this.userExist(dto);

    delete user.password;

    return { status: 'success', data: { user } };
  }
}
