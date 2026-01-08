import { Injectable } from '@nestjs/common';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { LLMService } from 'src/llm/service/llm.service';

@Injectable()
export class ChatService {
  constructor(private readonly llm: LLMService) {}

  async sendMessage(
    userText: string,
    messages: ChatCompletionMessageParam[],
    onDelta: (delta: string) => void,
  ) {
    // const moderation = await this.llm.checkModeration(userText);

    // if (moderation.flagged) {
    //   throw new Error('MODERATION_BLOCKED');
    // }

    messages.push({
      role: 'user',
      content: userText,
    });

    let fullReply = '';

    await this.llm.streamChat(messages, (chunk) => {
      fullReply += chunk;
      onDelta(chunk);
    });

    return fullReply;
  }
}
