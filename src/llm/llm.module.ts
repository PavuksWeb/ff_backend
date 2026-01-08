import { Module } from '@nestjs/common';
import { LLMService } from './service/llm.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [LLMService],
  exports: [LLMService],
  imports: [ConfigModule],
})
export class LLMModule {}
