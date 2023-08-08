import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  WsResponse
} from '@nestjs/websockets'
import { Types } from 'mongoose'
import { from, map, Observable } from 'rxjs'
import { Socket, Server } from 'socket.io'
import { Message } from './models/message.model'

import { SupportService } from './support.service'

@WebSocketGateway()
export class SupportGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly supportService: SupportService) {}

  @WebSocketServer() ws: Server

  afterInit(/* server: Server */) {
    console.log('WS server started!')
  }

  handleConnection(client: Socket) {
    console.log(`Подключился клиент: ${client.id}`)
  }

  handleDisconnect(client: Socket) {
    console.log(`Отключился клиент: ${client.id}`)
  }

  @SubscribeMessage('getAllMessages')
  getAllMessages(
    @MessageBody() chatId: Types.ObjectId
  ): Observable<WsResponse<Message[]>> {
    const data = this.supportService.getMessages(chatId)
    return from(data).pipe(map((data) => ({ event: 'all-messages', data })))
  }

  @SubscribeMessage('subscribeToChat')
  subscribeToChat(@MessageBody() chatId: Types.ObjectId, @ConnectedSocket() client: Socket) {
    client.join(chatId.toString())
  }
}
