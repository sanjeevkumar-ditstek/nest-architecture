import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import SocialTypes from '../../common/enums/SocialTypes';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Role' }], default: [] })
  roles: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Permission' }], default: [] })
  permissions: Types.ObjectId[];

  @Prop({ default: false })
  isSuperAdmin: boolean;

  @Prop({ enum: SocialTypes })
  provider: SocialTypes; // for social login

  @Prop()
  providerToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
