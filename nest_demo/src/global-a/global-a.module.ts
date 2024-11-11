import { Global, Module } from '@nestjs/common';
import { GlobalAService } from './global-a.service';
import { GlobalAController } from './global-a.controller';

@Global() // 只需要在AppModule中导入一次，就可以在全局范围内使用了
@Module({
  controllers: [GlobalAController],
  providers: [GlobalAService],
  exports: [GlobalAService],
})
export class GlobalAModule {}
