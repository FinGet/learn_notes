import { Module } from '@nestjs/common';
import { LifeCycleService } from './life-cycle.service';
import { LifeCycleController } from './life-cycle.controller';

@Module({
  controllers: [LifeCycleController],
  providers: [LifeCycleService],
})
export class LifeCycleModule {}
