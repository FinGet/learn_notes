import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 配置静态资源目录，前缀为 /static
  app.useStaticAssets('public', { prefix: '/static' });

  // 全局中间件
  app.use((req, res, next) => {
    console.log('root 全局中间件');
    next();
    console.log('root 全局中间件结束');
  });

  // 全局守卫 / 也可以在AppModule 中providers中配置
  // 在这里直接使用，那么不会进入loc 也就是不会建立依赖关系，也就不能注入其他服务
  // app.useGlobalGuards(new LoginGuard());

  await app.listen(3300);

  // setTimeout(() => {
  //   app.close();
  // }, 3000);
}
bootstrap();
