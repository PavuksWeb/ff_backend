import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { DatabaseModule } from 'src/database/database.module';
import { MessageService } from './services/message.service';
import { LLMModule } from 'src/llm/llm.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  providers: [MessageService],
  controllers: [MessageController],
  imports: [DatabaseModule, LLMModule, ChatModule],
  exports: [MessageService],
})
export class MessageModule {}
