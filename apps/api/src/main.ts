import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const parseAllowedOrigins = () => {
  const defaultLocalOrigins = [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3003',
    'http://localhost:3004',
  ];

  const configuredOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return configuredOrigins?.length
    ? configuredOrigins
    : process.env.NODE_ENV === 'development'
      ? defaultLocalOrigins
      : [];
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: parseAllowedOrigins(),
  });

  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
