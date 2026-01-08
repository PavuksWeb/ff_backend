import { Body, Controller, Get } from '@nestjs/common';
import { MessageService } from './services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Get()
  findMessages() {
    return this.service.getLastMessages();
  }
}
