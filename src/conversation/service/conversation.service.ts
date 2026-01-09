import { Injectable } from '@nestjs/common';
import { Role } from 'generated/prisma/enums';
import { ChatService } from 'src/chat/service/chat.service';
import { CreateMessageDto } from 'src/message/dto/createMessageDto';
import { MessageService } from 'src/message/services/message.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageService: MessageService,
  ) {}

  async sendAndStreamMessage(
    dto: CreateMessageDto,
    onDelta: (chunk: string) => void,
  ) {
    await this.messageService.createMessage(dto);

    const messages = await this.messageService.getLLMContext();

    const fullAssistantReply = await this.chatService.sendMessage(
      dto.text,
      messages,
      (chunk) => {
        onDelta(chunk);
      },
    );

    const assistantMessage = await this.messageService.createMessage({
      text: fullAssistantReply,
      role: Role.assistant,
    });

    return { assistantMessage };
  }
}
