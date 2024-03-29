import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findFirst({
      where: { id: payload.id, status: 'active' },
    });

    if (!user) {
      throw new UnauthorizedException(
        'The Owner Of The Session Is No Longer Active',
      );
    }

    delete user.password;
    return user;
  }
}

const cookieExtractor = (req: Request) => {
  let token = null;
  if (req && req.cookies) token = req.cookies['token'];
  return token;
};
