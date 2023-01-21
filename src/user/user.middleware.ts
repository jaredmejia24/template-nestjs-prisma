import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserExists implements NestMiddleware {
  constructor(private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const id = Number(req.params.id);

    if (isNaN(id) || id < 1) {
      throw new BadRequestException(
        'Id must be a number greater or equal to 1',
      );
    }

    const user = await this.prisma.user.findFirst({
      where: { id, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    req.user = user;
    next();
  }
}
