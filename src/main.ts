import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 3000);
}
bootstrap().catch(() => {
  console.error('Falha ao iniciar. Confira MONGODB_URI, usuario, senha e acesso de rede no Atlas.');
  process.exit(1);
});
