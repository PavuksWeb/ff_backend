import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
      .setTitle('Flirty Friend')
      .setDescription('The chat API, powered by OpenAI')
      .setVersion('1.0')
      .addTag('chat')
      .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    const port = process.env.PORT ?? 3000;
    await app.listen(port);

    logger.log(`Application is running on port: ${port}`);
  } catch (err) {
    logger.error(`Error starting application: ${err}`);
    process.exit(1);
  }
}
bootstrap();
