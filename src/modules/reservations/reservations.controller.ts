import {Controller, Get, Post, Body, Param, Delete, UseFilters, Query} from '@nestjs/common'
import {Types} from 'mongoose'
import {Roles} from '@modules/base/decorators/roles.decorator'
import {ReservationDto, ReservationSearchOptions} from './interfaces/reservation.interface'
import {ReservationsService} from './reservations.service'
import {Reservation} from './models/reservation.model'
import {HotelRoomsService} from '../hotels/hotels.service'
import {HttpException} from '@nestjs/common'
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {User} from "@modules/base/decorators/user.decorator";

@Controller('client')
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly hotelRoomService: HotelRoomsService
    ) {
    }

    @Roles('client')
    @UseFilters(ValidationExceptionFilter)
    @Post('reservations')
    async addReservation(@Body() data: ReservationDto, @User() user) {

        const room = await this.hotelRoomService.findById(data.room, true)
        if (!room) {
            throw new HttpException('Номер не найден', 400)
        }
console.log('log--','\n',
'user--',user,'\n',
)
        const reservationData = {...data, user: user._id, hotel: room.hotel._id}
        const reservation = await this.reservationsService.addReservation(reservationData)
        if (!reservation) {
            throw new HttpException('Номер занят', 400)
        }

        return {
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
            hotelRoom: {description: room.description, images: room.images},
            hotel: room.hotel
        }
    }

    @Roles('client')
    @Get('reservations')
    getReservations(@Query() filter: ReservationSearchOptions): Promise<Reservation[]> {
        return this.reservationsService.getReservations(filter)
    }

    @Roles('client')
    @Delete('reservations/:id')
    removeReservation(@Param('id') id: Types.ObjectId, @User() user) {
        return this.reservationsService.removeReservation(id, user)
    }
}
