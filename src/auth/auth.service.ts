import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  login() {
    return { status: 'success', login: 'login' };
  }

  async signup(dto) {
    try {
      //encrypt password
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      //create User
      const newUser = await this.prisma.user.create({
        data: {
          firstName: dto.firstName,
          password: hashedPassword,
          lastName: dto.lastName,
          email: dto.email,
        },
      });

      delete newUser.password;

      return { status: 'success', data: { newUser } };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Email Already Exists', HttpStatus.CONFLICT);
      }
    }
  }
}
