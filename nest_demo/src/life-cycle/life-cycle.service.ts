import {
  Injectable,
  OnModuleInit,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { CreateLifeCycleDto } from './dto/create-life-cycle.dto';
import { UpdateLifeCycleDto } from './dto/update-life-cycle.dto';

@Injectable()
export class LifeCycleService
  implements
    OnModuleInit,
    OnModuleDestroy,
    OnApplicationBootstrap,
    OnApplicationShutdown,
    BeforeApplicationShutdown
{
  onModuleInit() {
    console.log('LifeCycleService onModuleInit');
  }
  onApplicationBootstrap() {
    console.log('LifeCycleService onApplicationBootstrap');
  }

  onModuleDestroy() {
    console.log('LifeCycleService onModuleDestroy');
  }
  beforeApplicationShutdown(signal?: string) {
    console.log('LifeCycleService beforeApplicationShutdown', signal);
  }
  onApplicationShutdown() {
    console.log('LifeCycleService onApplicationShutdown');
  }

  create(createLifeCycleDto: CreateLifeCycleDto) {
    return 'This action adds a new lifeCycle';
  }

  findAll() {
    return `This action returns all lifeCycle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lifeCycle`;
  }

  update(id: number, updateLifeCycleDto: UpdateLifeCycleDto) {
    return `This action updates a #${id} lifeCycle`;
  }

  remove(id: number) {
    return `This action removes a #${id} lifeCycle`;
  }
}
