import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import mongoose from 'mongoose';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: mongoose.Model<User>,
  ) {}

  async findAll() {
    const user = await this.userModel.find();
    return user;
  }
  async create(user: User): Promise<User> {
    const res = await this.userModel.create(user);
    return res;
  }
}
