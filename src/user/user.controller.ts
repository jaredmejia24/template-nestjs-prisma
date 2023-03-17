import { UserService } from './user.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { UserParamsDto, UserUpdateDto } from './dto';
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
    return this.userService.getUserInSession(req.user);
  }

  @Get(':id')
  getUserById(@Param() params: UserParamsDto) {
    return this.userService.getUserById(params);
  }

  @Patch(':id')
  updateUser(
    @Body() body: UserUpdateDto,
    @Param() params: UserParamsDto,
    @Req() req: Request,
  ) {
    return this.userService.updateUser(body, params, req);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param() params: UserParamsDto, @Req() req: Request) {
    return this.userService.deleteUser(params, req);
  }
}
