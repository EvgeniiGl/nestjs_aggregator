import {Types} from 'mongoose'

import {Message} from '../models/message.model'
import {SupportRequest} from '../models/support-request.model'

export interface CreateSupportRequestDto {
    user: Types.ObjectId
    text: string
}

export interface SendMessageDto {
    author: Types.ObjectId
    supportRequest: Types.ObjectId
    text: string
}

export interface MarkMessagesAsReadDto {
    user: Types.ObjectId
    supportRequest: Types.ObjectId
    createdBefore: Date
}

export interface GetChatListParams {
    user: Types.ObjectId | null
    isActive: boolean
    limit: number
    offset: number
}

export interface ISupportRequestService {
    findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>

    sendMessage(data: SendMessageDto): Promise<Message>

    getMessages(supportRequest: Types.ObjectId): Promise<Message[]>

    subscribe(
        handler: (supportRequest: SupportRequest, message: Message) => void
    ): () => void
}

export interface ISupportRequestClientService {
    createRequest(data: CreateSupportRequestDto): Promise<SupportRequest>

    read(params: MarkMessagesAsReadDto)

    getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]>
}

export interface ISupportRequestEmployeeService {
    read(params: MarkMessagesAsReadDto)

    getUnreadCount(supportRequest: Types.ObjectId): Promise<Message[]>

    closeRequest(supportRequest: Types.ObjectId): Promise<void>
}
