import { UserService } from './user.service';
import { Controller, Get, Param, Req } from '@nestjs/common';
import { UserParamsDto } from './dto';
import { Request } from 'express';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('me')
  getUserInSession(@Req() req: Request) {
    return this.userService.getUserInSession(req);
  }

  @Get(':id')
  getUserById(@Param() dto: UserParamsDto) {
    return this.userService.getUserById(dto);
  }
}
