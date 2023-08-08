import {Module} from '@nestjs/common'
import {MongooseModule} from '@nestjs/mongoose'

import {SupportGateway} from './support.gateway'
import {SupportRequest, SupportRequestSchema} from './models/support-request.model'
import {Message, MessageModel} from './models/message.model'
import {SupportClientController} from "@modules/support/support-client.controller";
import {SupportManagerController} from "@modules/support/support-manager.controller";
import {SupportController} from "@modules/support/support.controller";
import {SupportClientService} from "@modules/support/support-client.service";
import {SupportManagerService} from "@modules/support/support-manager.service";
import {SupportService} from "@modules/support/support.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: SupportRequest.name, schema: SupportRequestSchema},
            {name: Message.name, schema: MessageModel}
        ])
    ],
    controllers: [SupportClientController, SupportManagerController, SupportController],
    providers: [SupportGateway, SupportClientService, SupportManagerService, SupportService],
    exports: [SupportClientService, SupportManagerService, SupportService]
})
export class SupportModule {
}
