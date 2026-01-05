import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { DatabaseModule } from 'src/database/database.module';
import { ConversationService } from './conversation';

@Module({
  providers: [ConversationService],
  controllers: [ConversationController],
  imports: [DatabaseModule],
  exports: [ConversationService],
})
export class ConversationModule {}
