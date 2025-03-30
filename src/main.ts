import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3001;
  app.useGlobalPipes(new ValidationPipe()); // enable validation for every endpoint
  await app.listen(port);
}
bootstrap();
