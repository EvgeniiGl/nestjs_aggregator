import {HttpException, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Model, Types} from 'mongoose'
import {SupportRequest, SupportRequestDocument} from './models/support-request.model'
import {
    GetChatListParams,
    ISupportRequestService,
    SendMessageDto
} from './interfaces/support.interface'
import {Message} from './models/message.model'
import {UserDocument} from '@modules/users/models/user.model'

@Injectable()
export class SupportService implements ISupportRequestService {
    constructor(
        @InjectModel(Message.name)
        private MessageModel: Model<Message>,
        @InjectModel(SupportRequest.name)
        private SupportRequestModel: Model<SupportRequest>
    ) {
    }

    async sendMessage(data: SendMessageDto, user?: UserDocument): Promise<Message> {
        const supportRequest = await this.SupportRequestModel.findById(data.supportRequest)
        if (supportRequest) {
            if (user && supportRequest.user !== user._id) throw new HttpException('Доступ запрещен', 403)
            const message = new this.MessageModel(data)
            await this.SupportRequestModel.findByIdAndUpdate(data.supportRequest, {
                $push: {messages: message}
            })
            return message
        }
    }

    async findSupportRequests(params: GetChatListParams): Promise<SupportRequestDocument[]> {
        const {limit, offset = 0, ...rest} = params
        const request = this.SupportRequestModel.find(rest).skip(offset)
        if (!rest.user) request.populate('user')
        if (limit) request.limit(limit)

        return await request.exec()
    }

    async getMessages(supportRequest: Types.ObjectId, user?: UserDocument): Promise<Message[]> {
        const request = await this.SupportRequestModel.findById(supportRequest).populate({
            path: 'messages.author',
            model: 'User'
        })
        if (user && request.user !== user._id) throw new HttpException('Запрещено', 403)
        return request.messages
    }

    subscribe(
        handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void {
        return function () {
        }

    }
}
