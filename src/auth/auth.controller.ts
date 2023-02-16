import { Request } from 'express';
import { LocalAuthGuard } from './local-auth.guard';
import { Body, Controller, Post } from '@nestjs/common';
import { HttpCode, Req, UseGuards } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { SkipAuth } from 'src/decorators/skipAuth';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    return this.authService.login(req.user);
  }

  @SkipAuth()
  @HttpCode(201)
  @Post('signup')
  signup(@Body() body: AuthDto) {
    return this.authService.signup(body);
  }
}
