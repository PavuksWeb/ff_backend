import OpenAI from 'openai';
import 'dotenv/config';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LLMService {
  private readonly client: OpenAI;
  private readonly logger = new Logger(LLMService.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async checkModeration(text: string) {
    try {
      const response = await this.client.moderations.create({
        model: 'omni-moderation-latest',
        input: text,
      });

      const result = response.results[0];

      return {
        flagged: result.flagged,
        categories: result.categories,
      };
    } catch (err) {
      this.logger.error(`Moderation API error: ${err}`);
      throw new InternalServerErrorException('Failed to check moderation');
    }
  }

  async streamChat(
    messages: ChatCompletionMessageParam[],
    onDelta: (delta: string) => void,
  ) {
    try {
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
    } catch (err) {
      this.logger.error(`OpenAI Stream error: ${err}`);
      throw err;
    }
  }
}
