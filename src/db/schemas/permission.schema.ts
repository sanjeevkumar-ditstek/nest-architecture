import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PermissionDocument = Permission & Document;

@Schema()
export class Permission {
  @Prop({ required: true, unique: true })
  module: string; // e.g., 'product', 'order', etc.

  @Prop({ required: true })
  action: string; // e.g., 'read', 'write', 'edit', 'delete'
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
