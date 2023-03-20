import { ApiTags } from '@nestjs/swagger/dist';
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
import {
  ApiCookieAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger/dist/decorators';

@ApiTags('Users')
@ApiCookieAuth('token')
@ApiUnauthorizedResponse({
  description: 'Missing token or user no longer active',
})
@Controller('api/v1/users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOkResponse({ description: 'Return all users in the database' })
  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @ApiOkResponse({ description: 'Return user in session' })
  @Get('me')
  getUserInSession(@Req() req: Request) {
    return this.userService.getUserInSession(req.user);
  }

  @ApiOkResponse({ description: 'Return user by id' })
  @ApiNotFoundResponse({ description: 'User not found or user disabled' })
  @Get(':id')
  getUserById(@Param() params: UserParamsDto) {
    return this.userService.getUserById(params);
  }

  @ApiOkResponse({ description: 'Return user updated' })
  @ApiNotFoundResponse({ description: 'User not found or user disabled' })
  @Patch(':id')
  updateUser(
    @Body() body: UserUpdateDto,
    @Param() params: UserParamsDto,
    @Req() req: Request,
  ) {
    return this.userService.updateUser(body, params, req.user);
  }

  @ApiNoContentResponse({ description: 'User deleted no response' })
  @ApiNotFoundResponse({ description: 'User not found or user disabled' })
  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param() params: UserParamsDto, @Req() req: Request) {
    return this.userService.deleteUser(params, req.user);
  }
}
