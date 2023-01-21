import { UserService } from './user.service';
import { Controller, Get, Param } from '@nestjs/common';
import { UserParamsDto } from './dto';

@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  getUserById(@Param() dto: UserParamsDto) {
    return this.userService.getUserById(dto);
  }
}
