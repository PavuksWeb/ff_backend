import { Module } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [AppGateway],
  imports: [ConversationModule],
})
export class AppGatewayModule {}
