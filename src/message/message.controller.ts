import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { MessageService } from './services/message.service';
import { CreateMessageDto } from './dto/createMessageDto';
import { UpdateMessageDto } from './dto/updateMessageDto';

@Controller('messages')
export class MessageController {
  constructor(private readonly service: MessageService) {}

  @Get()
  findMessages() {
    return this.service.getLastMessages();
  }

  @Post()
  postMessage(@Body() dto: CreateMessageDto) {
    return this.service.createMessage(dto);
  }

  @Put(':id')
  editMessage(@Param('id') id: string, @Body() dto: UpdateMessageDto) {
    return this.service.updateMessage(id, dto);
  }

  @Delete(':id')
  removeMessage(@Param('id') id: string) {
    return this.service.deleteMessage(id);
  }
}
