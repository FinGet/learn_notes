import { Inject, Injectable } from '@nestjs/common';
import { OtherService } from './other/other.service';
import { GlobalAService } from './global-a/global-a.service';

@Injectable() // 是可以被注入也是可以注入到别的对象的，所以用 @Injectable 声明，那么 nest 就会把它的对象放到 IOC 容器里。
export class AppService {
  @Inject(OtherService)
  private otherService: OtherService;

  @Inject('APP_NAME')
  private appName: string;

  @Inject(GlobalAService)
  private globalAService: GlobalAService;

  getHello(): string {
    return 'Hello World!' + this.otherService.test() + this.appName;
  }
}
