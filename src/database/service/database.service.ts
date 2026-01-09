import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class Database extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(Database.name);
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    super({ adapter });
  }

  async onModuleInit() {
    this.logger.log('Connecting to Database...');
    try {
      await this.$connect();
      this.logger.log('Successful connection to Database');
    } catch (err) {
      this.logger.error('Database connection failed.', err);
    }
  }
}
