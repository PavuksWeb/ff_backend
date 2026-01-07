import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/conversation';
import { CreateMessageDto } from 'src/conversation/dto/createMessageDto';
import { WsExceptionFilter } from 'src/conversation/filters/wsException.filter';
import { ModerationGuard } from 'src/conversation/guards/moderation.guard';

@WebSocketGateway({ cors: { origin: '*' } })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly conversationService: ConversationService) {}

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit() {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  @UseGuards(ModerationGuard)
  @UseFilters(WsExceptionFilter)
  async handleSendMessage(
    @MessageBody() dto: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const result = await this.conversationService.sendAndSaveMessage(
      dto.message,
    );

    client.emit('message_created', {
      role: 'assistant',
      message: result.assistantMessage.text,
      id: result.assistantMessage.id,
    });
  }
}
