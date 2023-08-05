import {Module} from '@nestjs/common'
import {ReservationsService} from './reservations.service'
import {ReservationsController} from './reservations.controller'
import {ReservationsManagerController} from './reservations-manager.controller'
import {MongooseModule} from '@nestjs/mongoose'
import {Reservation, ReservationModel} from './models/reservation.model'
import {HotelsModule} from '../hotels/hotels.module'

@Module({
    imports: [MongooseModule.forFeature([{name: Reservation.name, schema: ReservationModel}]), HotelsModule],
    controllers: [ReservationsController, ReservationsManagerController],
    providers: [ReservationsService],
    exports: [ReservationsService]
})
export class ReservationsModule {
}
