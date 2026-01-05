import { Injectable, NotFoundException } from '@nestjs/common';
import { Database } from 'src/database/database';
import { sendMessage } from 'src/llm/openai';

@Injectable()
export class ConversationService {
  constructor(private readonly db: Database) {}

  async createMessage(text: string): Promise<Message> {
    return this.db.message.create({ data: { text } });
  }

  async getMessages(): Promise<Message[]> {
    return this.db.message.findMany({ orderBy: { createdAt: 'asc' } });
  }

  async sendAndSaveMessage(
    userText: string,
  ): Promise<{ userMessage: Message; assistantMessage: Message }> {
    const userMessage = await this.createMessage(userText);

    const assistantReply = await sendMessage(userText);

    if (!assistantReply) {
      throw new NotFoundException('Assistant reply is empty');
    }

    const assistantMessage = await this.createMessage(assistantReply);

    return { userMessage, assistantMessage };
  }
}
