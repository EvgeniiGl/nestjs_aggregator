import {Controller, Get, Post, Body, Param, UseFilters} from '@nestjs/common'
import {Types} from 'mongoose'
import {User} from '@modules/base/decorators/user.decorator'
import {Role} from '@modules/base/decorators/role.decorator'
import {
    MarkMessagesAsReadDto, SendMessageDto,
} from './interfaces/support.interface'
import {SupportManagerService} from "@modules/support/support-manager.service";
import {SupportClientService} from "@modules/support/support-client.service";
import {SupportService} from "@modules/support/support.service";
import {Roles} from "@modules/users/models/user.model";
import {ParseObjectIdPipe} from "@modules/base/validations/parse-object-id-pipe";
import {ValidationExceptionFilter} from "@modules/base/exceptions/validation.exception.filter";
import {SupportGateway} from "@modules/support/support.gateway";

@Controller('common/support-requests')
export class SupportController {
    constructor(
        private readonly supportClientService: SupportClientService,
        private readonly supportRequestService: SupportService,
        private readonly supportRequestEmployeeService: SupportManagerService,
        private readonly supportGateway: SupportGateway
    ) {
    }

    @Role(Roles.CLIENT, Roles.MANAGER)
    @Get(':id/messages')
    async getSupportRequestMessages(@Param('id', ParseObjectIdPipe) requestId: Types.ObjectId, @User() user) {
        const messages = await this.supportRequestService.getMessages(requestId, user.role === Roles.CLIENT ? user : false)
        return messages.map((msg) => {
            const {author, ...rest} = msg
            const {_id, name} = author
            return {
                ...rest,
                author: {_id, name}
            }
        })
    }

    @Role(Roles.CLIENT, Roles.MANAGER)
    @Post(':id/messages/read')
    async read(
        @Body()
            params: Partial<MarkMessagesAsReadDto>,
        @Param('id', ParseObjectIdPipe) requestId: Types.ObjectId,
        @User() user
    ) {
        const data = {
            user: user._id,
            supportRequest: requestId,
            createdBefore: params.createdBefore
        }
        if (user.role === Roles.CLIENT) {
            await this.supportClientService.read(data)
        }
        if (user.role === Roles.MANAGER) {
            await this.supportRequestEmployeeService.read(data)
        }

        return {success: true}
    }

    @Role(Roles.CLIENT, Roles.MANAGER)
    @UseFilters(ValidationExceptionFilter)
    @Post(':id/messages')
    async sendMessage(
        @Param('id', ParseObjectIdPipe) requestId: Types.ObjectId,
        @Body()
            data: SendMessageDto,
        @User() user
    ) {
        const message = await this.supportRequestService.sendMessage(
            {
                author: user._id,
                supportRequest: requestId,
                text: data.text
            },
            user.role === Roles.CLIENT ? user : false
        )
        this.supportGateway.ws.to(requestId.toString()).emit('new-message', message)

        return message
    }
}
