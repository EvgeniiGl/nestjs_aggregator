import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import {Document, now, Types} from 'mongoose'
import { HotelDocument } from './hotel.model'

export type HotelRoomDocument = HotelRoom & Document

@Schema({
  timestamps: true
})
export class HotelRoom {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Hotel' })
  hotel: HotelDocument

  @Prop()
  description: string

  @Prop({ required: true, default: [] })
  images: string[]

  @Prop({ required: true, default: true })
  isEnabled: boolean
}

export const HotelRoomModel = SchemaFactory.createForClass(HotelRoom)
