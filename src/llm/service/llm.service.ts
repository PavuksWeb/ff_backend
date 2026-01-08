import OpenAI from 'openai';
import 'dotenv/config';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LLMService {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async checkModeration(text: string) {
    const response = await this.client.moderations.create({
      model: 'omni-moderation-latest',
      input: text,
    });

    const result = response.results[0];

    return {
      flagged: result.flagged,
      categories: result.categories,
    };
  }

  async streamChat(
    messages: ChatCompletionMessageParam[],
    onDelta: (delta: string) => void,
  ) {
    const stream = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';

      if (content) {
        onDelta(content);
      }
    }
  }
}
