import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { PORT } from './constans/constance';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  const config = new DocumentBuilder()
    .setTitle('Codica-finance')
    .setDescription('The apps API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
