import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: true,
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   credentials: true,
  // });


  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3002',
    ],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
