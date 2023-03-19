import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginDto } from './dto/auth.dto';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Body, Controller, Post, Get } from '@nestjs/common';
import { HttpCode, Req, Res, UseGuards } from '@nestjs/common/decorators';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { SkipAuth } from 'src/decorators/skipAuth';
import { ApiTags } from '@nestjs/swagger/dist';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger/dist/decorators';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOkResponse({ description: 'Return user and bearer token' })
  @ApiNotFoundResponse({ description: 'User not found or user disabled' })
  @ApiForbiddenResponse({ description: 'wrong email or password' })
  @HttpCode(200)
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user, res);
  }

  @HttpCode(200)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @ApiConflictResponse({ description: 'User with that email already exists' })
  @ApiCreatedResponse({ description: 'New user was made' })
  @SkipAuth()
  @HttpCode(201)
  @Post('signup')
  signup(@Body() body: SignUpDto) {
    return this.authService.signup(body);
  }

  @SkipAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  google() {
    return;
  }

  @SkipAuth()
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.googleCallback(req.user, res);
  }
}
