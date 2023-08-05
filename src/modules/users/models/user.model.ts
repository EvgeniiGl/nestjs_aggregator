import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {IsEmail, MinLength} from "class-validator";

export type UserDocument = User & Document

@Schema()
export class User {
  @IsEmail()
  @Prop({ required: true, unique: true })
  email: string
  
  @MinLength(6)
  @Prop({ required: true })
  password: string

  @Prop({ required: true })
  name: string

  @Prop({})
  contactPhone: string

  @Prop({ ofString: ['client', 'admin', 'manager'], default: 'client' })
  role: string
}

export const UserModel = SchemaFactory.createForClass(User)
