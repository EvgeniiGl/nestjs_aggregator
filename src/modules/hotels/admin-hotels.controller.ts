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

import {HotelRoomsService, HotelsService} from './hotels.service'
import {HotelRoom, HotelRoomDocument} from './models/hotel-room.model'
import {SearchHotelParams, UpdateHotelParams} from './interfaces/hotel.interface'
import {Roles} from '@modules/base/decorators/roles.decorator'
import {Hotel} from './models/hotel.model'
import {FilesInterceptor} from '@nestjs/platform-express'
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {
    filesInterceptorSetup,
    FORM_FIELD_NAME,
    imageParseFilePipeInstance,
    MAX_IMAGES_COUNT
} from "../../configs/multer.setup";
import { ObjectId } from 'mongoose';

@Roles('admin')
@Controller('admin')
export class AdminHotelsController {
    constructor(private readonly hotelsService: HotelsService, private readonly hotelRoomsService: HotelRoomsService) {
    }

    @UseFilters(ValidationExceptionFilter)
    @Post('hotels')
    async createHotel(@Body() data: Hotel) {
        const hotel = await this.hotelsService.create(data)
        return {
            id: hotel._id,
            title: hotel.title,
            description: hotel.description
        }
    }

    @Get('hotels')
    search(@Query() params: SearchHotelParams): Promise<Hotel[]> {
        return this.hotelsService.search(params)
    }

    @Put('hotels/:id')
    async updateHotel(@Param('id') id: Types.ObjectId, @Body() data: UpdateHotelParams) {
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
    async createHotelRoom(@Body() data: HotelRoom,
                          @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    ) {
        if (files) {
            console.log('log--','\n',
            'files--',files,'\n',
            )
            data.images = files.map((file) => file.filename)
        }

        return await this.hotelRoomsService.create(data)
    }

    @UseInterceptors(
        FilesInterceptor(FORM_FIELD_NAME, MAX_IMAGES_COUNT, filesInterceptorSetup),
    )
    @Put('hotel-rooms/:id')
    updateHotelRoom(
        @Param('id') id: Types.ObjectId,
        @Body() data: HotelRoomDocument,
        @UploadedFiles(imageParseFilePipeInstance) files: Express.Multer.File[],
    ) {
        if (files) {
            data.images = files.map((file) => file.originalname)
        }
        return this.hotelRoomsService.update(id, data)
    }
}
