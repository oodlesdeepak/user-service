import { Body, Controller, Post, Query } from '@nestjs/common';
// import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { PasswordRestDto } from './dto/password-reset.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('forget-password')
  async forgetPassword(@Body('email') email: string): Promise<{ msg: string }> {
    return await this.authService.sendEmailForgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body() body: PasswordRestDto,
  ): Promise<{ msg: string }> {
    return await this.authService.resetPassword(token, body);
  }
}
