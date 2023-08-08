import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import {IsEmail, IsEnum, MinLength} from "class-validator";

export type UserDocument = User & Document

export enum Roles {
  CLIENT = "client",
  ADMIN = "admin",
  MANAGER = "manager",
}

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

  @IsEnum(Roles, {each: true})
  @Prop({ofString: Roles, default: Roles.CLIENT})
  role: string
}

export const UserModel = SchemaFactory.createForClass(User)
