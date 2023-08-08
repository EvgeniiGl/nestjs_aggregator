import {Controller, Get, Post, Body, Param, UseFilters, Query} from '@nestjs/common'
import {User} from '@modules/base/decorators/user.decorator'
import {Role} from '@modules/base/decorators/role.decorator'
import {
    CreateSupportRequestDto,
    GetChatListParams,
} from './interfaces/support.interface'
import {SupportService} from './support.service'
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {SupportClientService} from "@modules/support/support-client.service";
import {Roles} from "@modules/users/models/user.model";

@Controller('client/support-requests')
export class SupportClientController {
    constructor(
        private readonly supportClientService: SupportClientService,
        private readonly supportRequestService: SupportService,
    ) {
    }

    @Role(Roles.CLIENT)
    @UseFilters(ValidationExceptionFilter)
    @Post()
    async createRequest(@Body() data: CreateSupportRequestDto, @User() user) {
        const request = await this.supportClientService.createRequest({
            ...data,
            user: user._id
        })

        await this.supportRequestService.sendMessage({
            author: user._id,
            supportRequest: request._id,
            text: data.text
        }, user)

        return [
            {
                id: request._id,
                createdAt: request.createdAt,
                isActive: true,
                hasNewMessages: false
            }
        ]
    }

    @Role(Roles.CLIENT)
    @Get()
    async getSupportRequests(@Query() params: GetChatListParams, @User() user) {
        const requests = await this.supportRequestService.findSupportRequests({
            ...params,
            user: user._id
        })
        return requests.map((req) => {
            const {messages, user, isActive, createdAt, _id} = req
            return {
                id: _id,
                createdAt,
                isActive,
                hasNewMessages: !!messages?.find((msg) => !msg.readAt && msg.author != user._id)
            }
        })
    }
}
