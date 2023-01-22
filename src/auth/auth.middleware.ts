import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  id: number;
}

@Injectable()
export class ProtectSession implements NestMiddleware {
  constructor(private config: ConfigService, private prisma: PrismaService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.cookies;

      if (!token) {
        throw new UnauthorizedException('Token Is Invalid');
      }

      const decoded = jwt.verify(
        token,
        this.config.get('JWT_SECRET'),
      ) as JwtPayload;

      const user = await this.prisma.user.findFirst({
        where: { id: decoded.id, status: 'active' },
      });

      if (!user) {
        throw new UnauthorizedException(
          'The Owner Of The Session Is No Longer Active',
        );
      }

      delete user.password;

      req.sessionUser = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Session Expired');
      }
      next(error);
    }
  }
}
