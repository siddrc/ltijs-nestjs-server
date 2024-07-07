import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpErrorHandler } from './http-error-handler/http-error-handler.filter';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
async function bootstrap() {
  const siteTitle = 'Relias-DE/LTIv1.3 API Docs';
  const app = await NestFactory.create(AppModule);
  app.use(
    ['/docs', '/docs-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle(siteTitle)
    .setDescription('Relias-DE/LTIv1.3 API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customSiteTitle: siteTitle,
  };
  SwaggerModule.setup('docs', app, document, customOptions);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );
  app.enableCors();
  app.useGlobalFilters(new HttpErrorHandler());
  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`
  ██╗  ████████╗██╗    ██╗   ██╗ ██╗   ██████╗ 
  ██║  ╚══██╔══╝██║    ██║   ██║███║   ╚════██╗
  ██║     ██║   ██║    ██║   ██║╚██║    █████╔╝
  ██║     ██║   ██║    ╚██╗ ██╔╝ ██║    ╚═══██╗
  ███████╗██║   ██║     ╚████╔╝  ██║██╗██████╔╝
  ╚══════╝╚═╝   ╚═╝      ╚═══╝   ╚═╝╚═╝╚═════╝ `);
}
bootstrap();
