import {Controller, Get, Query} from '@nestjs/common'
import {Role} from '@modules/base/decorators/role.decorator'
import {
    GetChatListParams,
} from './interfaces/support.interface';
import {SupportService} from './support.service'
import {Roles} from "@modules/users/models/user.model";

@Controller('manager/support-requests')
export class SupportManagerController {
    constructor(private readonly supportRequestService: SupportService) {
    }

    @Role(Roles.MANAGER)
    @Get()
    async getSupportRequests(@Query() params: GetChatListParams) {
        const requests = await this.supportRequestService.findSupportRequests(params)
        return requests.map((req) => {
            const {messages, user, isActive, createdAt, _id} = req
            const {id = _id, name, email, contactPhone} = user
            return {
                id: _id,
                isActive,
                createdAt,
                hasNewMessages: !!messages?.find((msg) => !msg.readAt),
                client: {id, name, email, contactPhone}
            }
        })
    }
}
