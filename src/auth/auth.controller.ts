import { Body, Controller, Post, Res } from '@nestjs/common';
import { HttpCode } from '@nestjs/common/decorators';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto, LoginDto } from './dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(200)
  @Post('login')
  login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(dto, res);
  }

  @HttpCode(201)
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
