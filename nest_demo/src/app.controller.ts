import {
  Controller,
  Get,
  HttpException,
  Inject,
  Logger,
  ParseIntPipe,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { GlobalAService } from './global-a/global-a.service';
import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './time.interceptor';
import { ValidatePipe } from './validate.pipe';
import { TestFilter } from './test.filter';

@Controller() // 装饰器，用于定义一个控制器, 还表示可以被注入
export class AppController {
  // 构造器注入 AppService
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(AppController.name);
  // 属性注入 AppService
  // @Inject(AppService)
  // private appService: AppService;

  @Inject(GlobalAService)
  private globalAService: GlobalAService;

  @Get()
  getHello(): string {
    this.logger.log('Hello world');
    return this.appService.getHello() + this.globalAService.sayHello('app');
  }

  @Get('aaa')
  // @UseGuards(LoginGuard) // 局部守卫
  getAaa(): string {
    return 'aaa';
  }

  @Get('bbb')
  @UseInterceptors(TimeInterceptor) // 局部拦截器
  getBbb(): string {
    return 'bbb';
  }

  @Get('ccc')
  @UseFilters(TestFilter) // 局部过滤器
  getCcc(@Query('num', ValidatePipe) num: number): string {
    return 'ccc' + num;
  }

  @Get('ddd') // ParseIntPipe 是一个内置的管道，用于将字符串转换为整数
  getDdd(@Query('dd', ParseIntPipe) dd: string): string {
    return dd + 'ddd';
  }

  // 自定义管道错误码和错误信息
  @Get('eee')
  getEee(
    @Query(
      'ee',
      new ParseIntPipe({
        // errorHttpStatusCode: 403,
        exceptionFactory: (error: string) => {
          // return {
          //   code: 403,
          //   message: 'Forbidden',
          //   error,
          // };
          throw new HttpException('Forbidden', 403);
        },
      }),
    )
    ee: number,
  ): string {
    return ee + 'eee';
  }
}
