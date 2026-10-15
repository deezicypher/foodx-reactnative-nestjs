import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  // app.set('trust proxy', 1); //Behind a proxy or loadbalancer Trust forward Otherwise every request appears to come from the proxy and all your users share one limit:
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    whitelist: true,
    forbidNonWhitelisted: true
  }))
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
