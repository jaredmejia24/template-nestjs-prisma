import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthDto, LoginDto } from './dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  async login(body: LoginDto, res: Response) {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new ForbiddenException('Wrong Credentials');
    }

    const token = jwt.sign({ id: user.id }, this.config.get('JWT_SECRET'), {
      expiresIn: '30d',
    });

    //set cookie
    const options = {
      httpOnly: true,
    };
    res.cookie('token', token, options);

    delete user.password;

    return { status: 'success', data: { user } };
  }

  async signup(body: AuthDto) {
    try {
      //encrypt password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(body.password, salt);

      //create User
      const newUser = await this.prisma.user.create({
        data: {
          firstName: body.firstName,
          password: hashedPassword,
          lastName: body.lastName,
          email: body.email,
        },
      });

      delete newUser.password;

      return { status: 'success', data: { newUser } };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email Already Exists');
      }
    }
  }

  logout(res: Response) {
    res.clearCookie('token');

    return { status: 'success', message: 'User is no longer in session' };
  }
}
