import { Module } from '@nestjs/common';
import { OtherService } from './other.service';

@Module({
  providers: [OtherService],
  exports: [OtherService], // 导出 OtherService 服务, 使得其他模块可以使用
})
export class OtherModule {}
