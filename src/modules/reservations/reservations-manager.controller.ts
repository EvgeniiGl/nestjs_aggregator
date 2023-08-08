import {Controller, Delete, Get, Param, Query} from '@nestjs/common';
import {ReservationsService} from "@modules/reservations/reservations.service";
import {Role} from "@modules/base/decorators/role.decorator";
import {Types} from "mongoose";
import {ReservationSearchOptions} from "@modules/reservations/interfaces/reservation.interface";
import {Reservation} from "@modules/reservations/models/reservation.model";
import {ParseObjectIdPipe} from "@modules/base/validations/parse-object-id-pipe";
import {Roles} from "@modules/users/models/user.model";

@Controller(Roles.MANAGER)
export class ReservationsManagerController {
    constructor(private readonly reservationsService: ReservationsService) {
    }

    @Role(Roles.MANAGER)
    @Get('reservations/:userId')
    getReservations(
        @Param('userId', ParseObjectIdPipe) userId: Types.ObjectId,
        @Query() filter: ReservationSearchOptions
    ): Promise<Reservation[]> {
        filter.user = userId
        return this.reservationsService.getReservations(filter)
    }

    @Role(Roles.MANAGER)
    @Delete('reservations/:reservationId')
    removeReservation(@Param('reservationId', ParseObjectIdPipe) id: Types.ObjectId) {
        return this.reservationsService.removeReservation(id)
    }
}
