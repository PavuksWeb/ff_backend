import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConversationModule } from './conversation/conversation.module';
import { AppGatewayModule } from './gateway/app.gateway.module';

@Module({
  imports: [DatabaseModule, ConversationModule, AppGatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
