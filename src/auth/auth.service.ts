import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schema/user.schema';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { PasswordRestDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mail: MailService,
  ) {}
  async generateToken(payload: any): Promise<string> {
    const tokenPayload = { userId: payload };
    return this.jwtService.sign(tokenPayload);
  }

  async verifyToken(token: string): Promise<any> {
    return this.jwtService.verify(token);
  }
  async securePassword(password: string) {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }

  async sendEmailForgetPassword(email: string): Promise<{ msg: string }> {
    try {
      const userFromDb = await this.userModel.findOne({ email: email });
      if (!userFromDb) {
        throw new HttpException('Login user not found', HttpStatus.NOT_FOUND);
      }
      const jwt = await this.generateToken(userFromDb._id);
      //const token = (Math.floor(Math.random() * 900000) + 1000000).toString();
      // const hashToken = await this.securePassword(token);
      // const updatedUser = await this.userModel.findOneAndUpdate(
      //   { email: email },
      //   { $set: { token: jwt } },
      //   { new: true },
      // );
      // await this.sendEmailBySmtp(email, jwt);
      await this.mail.sendEmailBySmtp(email, jwt);
      return { msg: 'Please check your email and reset your password' };
    } catch (error) {
      // Handle any errors that occur
      console.error('Error in sendEmailForgetPassword:', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async resetPassword(
    token: string,
    body: PasswordRestDto,
  ): Promise<{ success: boolean; msg: string; data?: any }> {
    const verifyJwt = await this.verifyToken(token);
    const user = await this.userModel.findOne({ _id: verifyJwt.userId });
    if (!user) {
      throw new HttpException('Token not found', HttpStatus.NOT_FOUND);
    }
    if (body.password !== body.confirm_password) {
      throw new HttpException('password not matched', HttpStatus.BAD_REQUEST);
    }
    const newPassword = await this.securePassword(body.password);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      { _id: user._id },
      { $set: { password: newPassword, token: '' } },
      { new: true },
    );

    return {
      success: true,
      msg: 'Password updated successfully',
      data: updatedUser,
    };
  }
}
