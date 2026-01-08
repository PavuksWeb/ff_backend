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
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConversationService } from 'src/conversation/service/conversation.service';
import { CreateMessageDto } from 'src/message/dto/createMessageDto';
import { WsExceptionFilter } from 'src/message/filters/wsException.filter';
import { ModerationGuard } from 'src/message/guards/moderation.guard';

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
    try {
      await this.conversationService.sendAndStreamMessage(dto, (chunk) => {
        client.emit('message_stream', chunk);
      });
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (err?.status === 429) {
        throw new WsException({
          code: 'TOO_MANY_REQUESTS',
          message: 'Too many requests. Try later.',
        });
      }
      throw err;
    } finally {
      client.emit('stream_end');
    }
  }
}
