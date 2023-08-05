import {Controller, Delete, Get, Param, Query} from '@nestjs/common';
import {ReservationsService} from "@modules/reservations/reservations.service";
import {Roles} from "@modules/base/decorators/roles.decorator";
import {Types} from "mongoose";
import {ReservationSearchOptions} from "@modules/reservations/interfaces/reservation.interface";
import {Reservation} from "@modules/reservations/models/reservation.model";


@Controller('manager')
export class ReservationsManagerController {
    constructor(private readonly reservationsService: ReservationsService) {
    }

    @Roles('manager')
    @Get('reservations/:userId')
    getReservations(
        @Param('userId') id: Types.ObjectId,
        @Query() filter: ReservationSearchOptions
    ): Promise<Reservation[]> {
        filter.userId = id

        return this.reservationsService.getReservations(filter)
    }

    @Roles('manager')
    @Delete('reservations/:reservationId')
    removeReservation(@Param('reservationId') id: Types.ObjectId) {
        return this.reservationsService.removeReservation(id)
    }
}
