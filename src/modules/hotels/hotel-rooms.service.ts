import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {
    HotelRoomService,
    SearchRoomsParams,
} from './interfaces/hotel.interface'
import {HotelRoom, HotelRoomDocument} from './models/hotel-room.model'

@Injectable()
export class HotelRoomsService implements HotelRoomService {
    constructor(
        @InjectModel(HotelRoom.name)
        private HotelRoomModel: Model<HotelRoomDocument>
    ) {
    }

    async create(data: Partial<HotelRoom>): Promise<HotelRoom> {
        const room = new this.HotelRoomModel(data)
        return await room.save().then((room) =>
            room.populate({
                path: 'hotel',
                select: {title: 1, description: 1}
            })
        )
    }

    async findById(id: Types.ObjectId, isEnabled?: true): Promise<HotelRoom> {
        const room = await this.HotelRoomModel.findById(id, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
            .limit(1)
            .populate({
                path: 'hotel',
                select: {title: 1, description: 1}
            })
            .exec()

        return (isEnabled && room?.isEnabled) || isEnabled === undefined ? room : null
    }

    async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
        const {limit, offset = 0, title, ...rest} = params
        const query = this.HotelRoomModel.find(rest, {
            isEnabled: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
        if (params.limit) {
            query.limit(limit)
        }
        if (params.offset) {
            query.skip(offset)
        }

        const findedRooms = await query.populate({
            path: 'hotel',
            select: {title: 1}
        }).exec()
        return title ? findedRooms.filter((room) => room.hotel.title == title) : findedRooms
    }

    async update(id: Types.ObjectId, data: Partial<HotelRoom>): Promise<HotelRoom> {
        return this.HotelRoomModel.findByIdAndUpdate(id, data, {new: true}).exec()
    }
}
