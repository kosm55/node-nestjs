import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { AppConfig } from './configs/config.type';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //створ і ініціалізац нашої апки

  const configService = app.get(ConfigService); //отримуємо досту до ConfigService,
  // який є частиною @nestjs/config пакету
  const appConfig = configService.get<AppConfig>('app'); //отримуємо конфігураційні дані з configService для 'app'

  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    // глобальнйи канал валідації усіїє апки
    new ValidationPipe({
      //кожен вхідний запит валідується і чекається тут спочатку
      transform: true, //вхідні дані будуть автоматично перетворені на типи, визначені у DTO
      whitelist: true, //все що передаємо лишнє проігнорується, напр.у юзера нема поля карс,
      // переданий карс буде проігнорований
      //усі зайві поля, які не визначені у  DTO, будуть автоматично видалені
      forbidNonWhitelisted: true, // має бути помилка, що такого переаного поля не існує
      //якщо вхідні дані містять поля, які не визначені у  DTO, буде викликана помилка валідації
    }),
  );
  await app.listen(appConfig.port, appConfig.host, () => {
    console.log(`server running on http://${appConfig.host}:${appConfig.port}`);
    console.log(
      `swagger running on http://${appConfig.host}:${appConfig.port}/docs`,
    );
  });
}
void bootstrap();
