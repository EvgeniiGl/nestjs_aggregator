import {Module} from '@nestjs/common'
import {AdminHotelsController} from './admin-hotels.controller'
import {MongooseModule} from '@nestjs/mongoose'
import {Hotel, HotelSchema} from './models/hotel.model'
import {HotelRoom, HotelRoomModel} from './models/hotel-room.model'
import {HotelRoomsController} from "@modules/hotels/hotel-rooms.controller";
import {MulterModule} from "@nestjs/platform-express";
import {HotelsService} from "@modules/hotels/hotels.service";
import {HotelRoomsService} from "@modules/hotels/hotel-rooms.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Hotel.name, schema: HotelSchema},
            {name: HotelRoom.name, schema: HotelRoomModel}
        ]),
        MulterModule.register({
            dest: process.env.IMAGE_STORAGE_DESTINATION,
        }),
    ],
    controllers: [AdminHotelsController, HotelRoomsController],
    providers: [HotelsService, HotelRoomsService],
    exports: [HotelsService, HotelRoomsService]
})
export class HotelsModule {
}
