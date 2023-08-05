import {
    Controller,
    Get,
    Param,
    Query,
} from '@nestjs/common'
import {Types} from 'mongoose'

import {HotelRoomsService} from './hotels.service'
import {HotelRoom} from './models/hotel-room.model'
import {SearchRoomsParams} from './interfaces/hotel.interface'
import {PublicRoute} from "@modules/base/decorators/public_route.decorator";

@Controller('hotel-rooms')
export class HotelRoomsController {
    constructor(private readonly hotelRoomsService: HotelRoomsService) {
    }

    @PublicRoute()
    @Get()
    public search(@Query() params: SearchRoomsParams): Promise<HotelRoom[]> {
        return this.hotelRoomsService.search(params)
    }

    @PublicRoute()
    @Get(':id')
    public findById(@Param('id') id: Types.ObjectId): Promise<HotelRoom> {
        return this.hotelRoomsService.findById(id, true)
    }
}
