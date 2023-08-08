import {Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {SupportRequest} from './models/support-request.model'
import {
    ISupportRequestEmployeeService,
    MarkMessagesAsReadDto,
} from './interfaces/support.interface'
import {Message} from './models/message.model'

@Injectable()
export class SupportManagerService implements ISupportRequestEmployeeService {
    constructor(
        @InjectModel(SupportRequest.name)
        private SupportRequestModel: Model<SupportRequest>
    ) {
    }

    async read(params: MarkMessagesAsReadDto) {
        const request = await this.SupportRequestModel
            .findById(params.supportRequest)
            .populate({
                path: 'messages.author',
                model: 'User'
            })
        if (!request.messages) {
            return request
        }
        const now = new Date()
        const createdBefore = params.createdBefore ? new Date(params.createdBefore) : now

        let update = false
        const messages = request.messages.map((msg) => {
            if (new Date(msg.sentAt) <= createdBefore && msg.author._id.toString() === request.user && !msg.readAt) {
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

    async getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]> {
        const request = await this.SupportRequestModel.findById(supportRequest)
        return request.messages.filter((msg) => !msg.readAt && msg.author != request.user)
    }

    async closeRequest(supportRequest: Types.ObjectId): Promise<void> {
        return this.SupportRequestModel.findByIdAndUpdate(supportRequest, {isActive: false}, {new: true});
    }
}
