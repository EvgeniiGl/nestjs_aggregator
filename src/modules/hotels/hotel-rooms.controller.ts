import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common'
import {Types} from 'mongoose'
import {HotelRoom} from './models/hotel-room.model'
import {SearchRoomsParams} from './interfaces/hotel.interface'
import {PublicRoute} from "@modules/base/decorators/public_route.decorator";
import {User} from "@modules/base/decorators/user.decorator";
import {ParseObjectIdPipe} from "@modules/base/validations/parse-object-id-pipe";
import {HotelRoomsService} from "@modules/hotels/hotel-rooms.service";
import {Roles} from "@modules/users/models/user.model";

@Controller('common/hotel-rooms')
export class HotelRoomsController {
    constructor(private readonly hotelRoomsService: HotelRoomsService) {
    }

    @PublicRoute()
    @Get()
    public search(@Query() params: SearchRoomsParams, @User() user): Promise<HotelRoom[]> {
        if (!user || (user && user.role === Roles.CLIENT)) {
            params.isEnabled = true
        }
        return this.hotelRoomsService.search(params)
    }

    @PublicRoute()
    @Get(':id')
    public getById(@Param('id', ParseObjectIdPipe) params: Types.ObjectId): Promise<HotelRoom> {
        return this.hotelRoomsService.findById(params)
    }
}
