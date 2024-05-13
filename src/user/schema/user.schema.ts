import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop()
  email: string;
  @Prop()
  password: string;
  @Prop()
  name: string;
  @Prop()
  role: string;
  @Prop()
  token: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
