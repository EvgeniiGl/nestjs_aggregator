import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose'
import {Date, Document, Types} from 'mongoose'
import {HotelRoom} from '@modules/hotels/models/hotel-room.model'
import {Hotel} from '@modules/hotels/models/hotel.model'
import {User} from '@modules/users/models/user.model'

export type ReservationDocument = Reservation & Document

@Schema()
export class Reservation {
    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    user: User

    @Prop({required: true, type: Types.ObjectId, ref: 'Hotel'})
    hotel: Hotel

    @Prop({required: true, type: Types.ObjectId, ref: 'HotelRoom'})
    room: HotelRoom

    @Prop({required: true, type: Date})
    dateStart: string

    @Prop({required: true, type: Date})
    dateEnd: string
}

export const ReservationModel = SchemaFactory.createForClass(Reservation)
