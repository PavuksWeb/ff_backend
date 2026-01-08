import { Module } from '@nestjs/common';
import { AppGateway } from './service/app.gateway.service';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  providers: [AppGateway],
  imports: [ConversationModule],
})
export class AppGatewayModule {}
