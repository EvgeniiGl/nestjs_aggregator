import {Types} from 'mongoose'
import {Reservation} from '../models/reservation.model'
import {IsDefined, IsMongoId} from "class-validator";

export class ReservationDto {
    user: Types.ObjectId
    hotel: Types.ObjectId
    @IsDefined()
    @IsMongoId()
    room: Types.ObjectId
    @IsDefined()
    dateStart: Date
    @IsDefined()
    dateEnd: Date
}

export interface ReservationSearchOptions {
    user: Types.ObjectId
    dateStart: Date
    dateEnd: Date
}

export interface IReservation {
    addReservation(data: ReservationDto): Promise<Reservation>

    removeReservation(id: Types.ObjectId): Promise<void>

    getReservations(filter: ReservationSearchOptions): Promise<Array<Reservation>>
}
