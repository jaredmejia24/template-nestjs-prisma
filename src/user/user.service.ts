import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

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

  getUserById(req: Request) {
    const { user } = req;

    delete user.password;

    return { status: 'success', data: { user } };
  }
}
