import { Module } from '@nestjs/common';
import { ChatModule } from 'src/chat/chat.module';
import { MessageModule } from 'src/message/message.module';
import { ConversationService } from './service/conversation.service';

@Module({
  imports: [ChatModule, MessageModule],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
