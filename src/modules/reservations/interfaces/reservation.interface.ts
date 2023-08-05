import {Types} from 'mongoose'
import {Reservation} from '../models/reservation.model'
import {IsDefined} from "class-validator";

export class ReservationDto {
    @IsDefined()
    user: Types.ObjectId
    @IsDefined()
    hotel: Types.ObjectId
    @IsDefined()
    room: Types.ObjectId
    dateStart: Date
    dateEnd: Date
}

export interface ReservationSearchOptions {
    userId: Types.ObjectId
    dateStart: Date
    dateEnd: Date
}

export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>

    removeReservation(id: Types.ObjectId): Promise<void>

    getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>
}
