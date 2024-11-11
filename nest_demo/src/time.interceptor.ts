import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

// interceptor 集成了 Rxjs

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(context.getClass(), context.getHandler());

    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        console.log(`耗时：${Date.now() - startTime}ms`);
      }),
    );
  }
}
