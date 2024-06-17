import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { OtherModule } from './other/other.module';

@Module({
  controllers: [AppController], // 只能被注入
  providers: [AppService], // 可以被注入，也可以注入别的对象
  imports: [PersonModule, OtherModule],
})
export class AppModule {}
