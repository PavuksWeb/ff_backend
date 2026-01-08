import { Module } from '@nestjs/common';
import { Database } from './service/database.service';

@Module({
  providers: [Database],
  exports: [Database],
})
export class DatabaseModule {}
