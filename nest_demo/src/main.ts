import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源目录，前缀为 /static
  app.useStaticAssets('public', { prefix: '/static' });
  await app.listen(3300);
}
bootstrap();
