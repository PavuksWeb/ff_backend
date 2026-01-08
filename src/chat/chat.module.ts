import { Module } from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { LLMModule } from 'src/llm/llm.module';

@Module({
  providers: [ChatService],
  exports: [ChatService],
  imports: [LLMModule],
})
export class ChatModule {}
