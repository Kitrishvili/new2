import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser())
  app.enableCors({
    origin:[process.env.CLIENT_URL]
  })

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
