import { Inject, Injectable } from '@nestjs/common';
import { GlobalAService } from 'src/global-a/global-a.service';

@Injectable()
export class OtherService {
  @Inject(GlobalAService)
  private globalAService: GlobalAService;

  test() {
    return 'test' + this.globalAService.sayHello('other');
  }
}
