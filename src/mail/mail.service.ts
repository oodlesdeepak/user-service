import { Injectable } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';

import * as nodemailer from 'nodemailer';

import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  async sendEmailBySmtp(email: string, jwt: string): Promise<void> {
    try {
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST'),
        port: this.configService.get<number>('MAIL_PORT'),
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('MAIL_USER'),
        to: email,
        subject: 'Password Reset',
        html: `<p>click here <a href="http://127.0.0.1:8081/auth/reset-password?token=${jwt}">Reset Password</a></p>`,
      };
      console.log(
        `<a href="http://127.0.0.1:8081/auth/reset-password?token=${jwt}"</a>`,
      );
      const info = await transporter.sendMail(mailOptions);
      console.log('Mail has been sent:', info.response);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
