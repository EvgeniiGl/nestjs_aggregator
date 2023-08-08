import {Controller, Get, Post, Body, Param, Delete, UseFilters, Query} from '@nestjs/common'
import {Types} from 'mongoose'
import {Role} from '@modules/base/decorators/role.decorator'
import {ReservationDto, ReservationSearchOptions} from './interfaces/reservation.interface'
import {ReservationsService} from './reservations.service'
import {Reservation} from './models/reservation.model'
import {HttpException} from '@nestjs/common'
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {User} from "@modules/base/decorators/user.decorator";
import {HotelRoomsService} from "@modules/hotels/hotel-rooms.service";
import {ParseObjectIdPipe} from "@modules/base/validations/parse-object-id-pipe";
import {Roles} from "@modules/users/models/user.model";

@Controller(Roles.CLIENT)
export class ReservationsController {
    constructor(
        private readonly reservationsService: ReservationsService,
        private readonly hotelRoomService: HotelRoomsService
    ) {
    }

    @Role(Roles.CLIENT)
    @UseFilters(ValidationExceptionFilter)
    @Post('reservations')
    async addReservation(@Body() data: ReservationDto, @User() user) {

        const room = await this.hotelRoomService.findById(data.room, true)
        if (!room) {
            throw new HttpException('Номер не найден', 400)
        }

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

    @Role(Roles.CLIENT)
    @Get('reservations')
    getReservations(@Query() filter: ReservationSearchOptions, @User() user): Promise<Reservation[]> {
        filter.user = user._id
        return this.reservationsService.getReservations(filter)
    }

    @Role(Roles.CLIENT)
    @Delete('reservations/:id')
    removeReservation(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @User() user) {
        return this.reservationsService.removeReservation(id, user)
    }
}
