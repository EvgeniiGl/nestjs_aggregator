import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseFilters,
    Put,
    UseInterceptors,
    UploadedFiles
} from '@nestjs/common'
import {Types} from 'mongoose'

import {HotelRoom, HotelRoomDocument} from './models/hotel-room.model'
import {SearchHotelParams, UpdateHotelParams} from './interfaces/hotel.interface'
import {Role} from '@modules/base/decorators/role.decorator'
import {Hotel} from './models/hotel.model'
import {FilesInterceptor} from '@nestjs/platform-express'
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {
    filesInterceptorSetup,
    FORM_FIELD_NAME,
    imageParseFilePipeInstance,
    MAX_IMAGES_COUNT
} from "../../configs/multer.setup";
import {HotelsService} from "@modules/hotels/hotels.service";
import {HotelRoomsService} from "@modules/hotels/hotel-rooms.service";
import {ParseObjectIdPipe} from "@modules/base/validations/parse-object-id-pipe";
import {Roles} from "@modules/users/models/user.model";

@Controller(Roles.ADMIN)
export class AdminHotelsController {
    constructor(private readonly hotelsService: HotelsService, private readonly hotelRoomsService: HotelRoomsService) {
    }

    @UseFilters(ValidationExceptionFilter)
    @Post('hotels')
    @Role(Roles.ADMIN)
    async createHotel(@Body() data: Hotel) {
        const hotel = await this.hotelsService.create(data)
        return {
            id: hotel._id,
            title: hotel.title,
            description: hotel.description
        }
    }

    @Get('hotels')
    @Role(Roles.ADMIN)
    search(@Query() params: SearchHotelParams): Promise<Hotel[]> {
        return this.hotelsService.search(params)
    }

    @Put('hotels/:id')
    @Role(Roles.ADMIN)
    async updateHotel(@Param('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() data: UpdateHotelParams) {
        const hotel = await this.hotelsService.update(id, data)
        return {
            id: hotel._id,
            title: hotel.title,
            description: hotel.description
        }
    }

    @UseFilters(ValidationExceptionFilter)
    @UseInterceptors(
        FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
    )
    @Post('hotel-rooms')
    @Role(Roles.ADMIN)
    async createHotelRoom(@Body() data: HotelRoom,
                          @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    ) {
        if (files.length > 0) {
            data.images = files.map((file) => file.filename)
        }

        return await this.hotelRoomsService.create(data)
    }

    @UseInterceptors(
        FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
    )
    @Put('hotel-rooms/:id')
    @Role(Roles.ADMIN)
    updateHotelRoom(
        @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
        @Body() data: HotelRoomDocument,
        @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    ) {
        if (files.length > 0) {
            data.images = files.map((file) => file.originalname)
        }
        return this.hotelRoomsService.update(id, data)
    }
}
