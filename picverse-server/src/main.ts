import { INestApplication, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { HttpExceptionFilter, MongoExceptionFilter } from "@common/filters";
import { LoggingInterceptor, ResponseInterceptor } from "@common/interceptors";
import { AppModule } from "@modules/app";
import { AppLogger } from "./common/utils";

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  // app.useLogger(new AppLogger());
  app.enableCors({
    origin: [configService.get<string>("CLIENT_ORIGIN")],
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new MongoExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      whitelist: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor(), new LoggingInterceptor());
  app.setGlobalPrefix("/api");

  const config = new DocumentBuilder()
    .setTitle("Picverse server")
    .setDescription("Picverse web server using Nest JS")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "Bearer",
        bearerFormat: "JWT",
      },
      "authorization",
    )
    .addServer("/")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/", app, document, {
    jsonDocumentUrl: "/json",
  });

  await app.listen(configService.get<number>("APPLICATION_RUNNING_PORT"));
}
bootstrap();
