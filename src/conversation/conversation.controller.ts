import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConversationService } from './conversation';
import { CreateMessageDto } from './dto/createMessageDto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly service: ConversationService) {}

  @Get()
  findMessages() {
    return this.service.getMessages();
  }

  @Post()
  createMessages(@Body() dto: CreateMessageDto) {
    return this.service.sendAndSaveMessage(dto.message);
  }
}
