import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 装饰器，用于定义一个控制器, 还表示可以被注入
export class AppController {
  // 构造器注入 AppService
  constructor(private readonly appService: AppService) {}

  // 属性注入 AppService
  // @Inject(AppService)
  // private appService: AppService;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
