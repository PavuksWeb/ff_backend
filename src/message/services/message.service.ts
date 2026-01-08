import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { Database } from 'src/database/service/database.service';
import { CreateMessageDto } from '../dto/createMessageDto';

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

  async createUserMessage(dto: CreateMessageDto) {
    return this.db.message.create({
      data: {
        text: dto.message,
        role: dto.role,
      },
    });
  }

  async createAssistantMessage(text: string) {
    return this.db.message.create({
      data: {
        text,
        role: 'assistant',
      },
    });
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
      role: m.role as 'user' | 'assistant',
      content: m.text,
    }));

    return [systemMessage, ...chatMessages];
  }
}
