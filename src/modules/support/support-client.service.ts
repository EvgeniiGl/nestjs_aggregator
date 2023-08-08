import {HttpException, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {SupportRequest, SupportRequestDocument} from './models/support-request.model'
import {
    CreateSupportRequestDto,
    ISupportRequestClientService,
    MarkMessagesAsReadDto,
} from './interfaces/support.interface'
import {Message} from './models/message.model'
import {UserDocument} from '@modules/users/models/user.model'

@Injectable()
export class SupportClientService implements ISupportRequestClientService {
    constructor(
        @InjectModel(SupportRequest.name)
        private SupportRequestModel: Model<SupportRequest>
    ) {
    }

    async createRequest(data: CreateSupportRequestDto): Promise<SupportRequestDocument> {
        const supportRequest = new this.SupportRequestModel(data)
        return await supportRequest.save()
    }

    async read(params: MarkMessagesAsReadDto) {
        const request = await this.SupportRequestModel
            .findById(params.supportRequest)
            .populate({
                path: 'messages.author',
                model: 'User'
            })
            .populate({
                path: 'user',
                model: 'User'
            })

        if (request.user._id.toString() !== params.user) {
            throw new HttpException('Доступ запрещен', 403)
        }

        if (!request.messages) {
            return request
        }

        const now = new Date()
        const createdBefore = params.createdBefore ? new Date(params.createdBefore) : now

        let update = false
        const messages = request.messages.map((msg) => {
            if (new Date(msg.sentAt) <= createdBefore && msg.author._id.toString() !== params.user && !msg.readAt) {
                msg.readAt = now.toISOString()
                update = true
            }
            return msg;
        })
        if (update) {
            await this.SupportRequestModel.findByIdAndUpdate(
                params.supportRequest,
                {messages: messages},
                {new: true}
            )
        }

        return request
    }

    async getUnreadCount(supportRequest: Types.ObjectId, user?: UserDocument): Promise<Message[]> {
        const request = await this.SupportRequestModel.findById(supportRequest)
        return request.messages.filter((msg) => !msg.readAt && msg.author != user._id)
    }
}
