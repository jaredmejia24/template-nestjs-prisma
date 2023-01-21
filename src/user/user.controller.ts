import { Request } from 'express';
import { UserService } from './user.service';
import { Controller, Get, Req } from '@nestjs/common';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Req() req: Request) {
    return this.userService.getUserById(req);
  }
}
