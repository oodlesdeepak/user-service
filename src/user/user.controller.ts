import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { CreateUserDto } from './dto/createAdmin.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find')
  async getAllUser(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post('create')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return this.userService.create(user);
  }
}
