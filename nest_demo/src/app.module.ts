import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { OtherModule } from './other/other.module';
import { GlobalAModule } from './global-a/global-a.module';
import { LifeCycleModule } from './life-cycle/life-cycle.module';
import { LogMiddleware } from './log.middleware';
import { LoginGuard } from './login.guard';

@Module({
  controllers: [AppController], // 只能被注入
  providers: [
    AppService,

    // 这里不能直接使用 LoginGuard
    {
      provide: 'APP_GUARD', // 令牌 token APP_GUARD 是一个预定义的令牌，用于注册全局 Guard。
      useClass: LoginGuard,
    },
    {
      // 值提供者
      provide: 'APP_NAME', // 令牌 token
      useValue: 'Nest App',
    },
    {
      // 工厂提供者
      provide: 'APP_NAME_FACTORY', // 令牌 token
      useFactory: () => {
        return 'Nest App Factory';
      },
    },
    {
      // 异步工厂提供者
      provide: 'APP_NAME_ASYNC_FACTORY', // 令牌 token
      useFactory: async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve('Nest App Async Factory');
          }, 1000);
        });
      },
    },
  ], // 可以被注入，也可以注入别的对象
  imports: [PersonModule, OtherModule, GlobalAModule, LifeCycleModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply((req, res, next) => {
    //     console.log('app 全局中间件');
    //     next();
    //     console.log('app 全局中间件结束');
    //   })
    //   .forRoutes('*');
    consumer.apply(LogMiddleware).forRoutes('*');
  }
}
