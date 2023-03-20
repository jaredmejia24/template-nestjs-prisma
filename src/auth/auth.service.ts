import { Response } from 'express';
import { LoginDto } from './dto/auth.dto';
import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common/exceptions';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validate(body: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: body.email, status: 'active' },
    });

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
      throw new ForbiddenException('Wrong Credentials');
    }

    delete user.password;

    return user;
  }

  async login(user: User, res: Response) {
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);

    // 2592000000 milisegundos = 30 dias
    res.cookie('token', token, { httpOnly: true, maxAge: 2592000000 });

    return {
      status: 'success',
      data: { user },
    };
  }

  async googleCallback(user: User, res: Response) {
    const payload = { id: user.id };
    const token = this.jwtService.sign(payload);

    // 2592000000 milisegundos = 30 dias
    res
      .cookie('token', token, { httpOnly: true, maxAge: 2592000000 })
      .redirect('/');
  }

  async logout(res: Response) {
    res.clearCookie('token');
    return { status: 'user is no longer in session' };
  }

  async signup(body: SignUpDto) {
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
}
