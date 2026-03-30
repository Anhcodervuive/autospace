import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'https://studio.apollographql.com',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  const config = new DocumentBuilder()
    .setTitle('Autospace | Edward Do')
    .setDescription(
      `The Autospace API
      <h1>Looking for GraphQL api ? </h1>
      Go to the <a href="/graphql" target="_blank">GraphQL</a>.
      Or,
      You might you might also need to use <a href="https://studio.apollographql.com/sandbox/explorer" target="_blank">Apollo explorer</a>
      to have a greater experiance.
      `,
    )
    .setVersion('0.1')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
