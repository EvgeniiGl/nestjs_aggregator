import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {
    IHotelService,
    SearchHotelParams,
    UpdateHotelParams
} from './interfaces/hotel.interface'
import {Hotel, HotelDocument} from './models/hotel.model'

@Injectable()
export class HotelsService implements IHotelService {
    constructor(@InjectModel(Hotel.name) private HotelModel: Model<HotelDocument>) {
    }

    async create(data: Hotel): Promise<HotelDocument> {
        const time = Date.now()
        const hotel = new this.HotelModel({
            ...data,
            createdAt: time,
            updatedAt: time
        })

        return await hotel.save()
    }

    async findById(id: Types.ObjectId): Promise<HotelDocument> {
        return await this.HotelModel.findById(id).exec()
    }

    async search(params: SearchHotelParams): Promise<Hotel[]> {
        let filter: { title?: string } = {}
        if (params.title) {
            filter.title = params.title
        }
        const query = this.HotelModel.find(filter, {
            createdAt: 0,
            updatedAt: 0,
            __v: 0
        })
        if (params.limit) {
            query.limit(params.limit)
        }
        if (params.offset) {
            query.skip(params.offset)
        }

        return await query.exec()
    }

    async update(id: Types.ObjectId, data: UpdateHotelParams): Promise<HotelDocument> {
        return this.HotelModel.findByIdAndUpdate(id, data, {new: true}).exec()
    }
}
