import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on port: ${port}`);
  } catch (err) {
    logger.error(`Error starting application: ${err}`);
    process.exit(1);
  }
}
bootstrap();
