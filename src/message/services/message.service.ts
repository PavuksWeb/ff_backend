import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { Database } from 'src/database/service/database.service';
import { CreateMessageDto } from '../dto/createMessageDto';
import { UpdateMessageDto } from '../dto/updateMessageDto';

@Injectable()
export class MessageService {
  constructor(private readonly db: Database) {}

  async getLastMessages(cursorId?: string, pageSize: number = 10) {
    const messages = await this.db.message.findMany({
      take: pageSize,
      ...(cursorId && {
        skip: 1,
        cursor: { id: cursorId },
      }),
      orderBy: { createdAt: 'asc' },
    });
    return messages;
  }

  async createMessage(dto: CreateMessageDto) {
    return this.db.message.create({
      data: {
        text: dto.text,
        role: dto.role,
      },
    });
  }

  async updateMessage(id: string, dto: UpdateMessageDto) {
    return this.db.message.update({
      where: { id },
      data: { text: dto.text },
    });
  }

  async deleteMessage(id: string) {
    return this.db.message.delete({ where: { id } });
  }

  async getLLMContext(): Promise<ChatCompletionMessageParam[]> {
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content:
        "Pretend you're my girlfriend. Respond playfully, with a touch of humor.",
    };

    const messages = await this.db.message.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const chatMessages = messages.map((m) => ({
      role: m.role,
      content: m.text,
    }));

    return [systemMessage, ...chatMessages];
  }
}
