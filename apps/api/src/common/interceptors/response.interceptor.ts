import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '../interfaces/response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponse<T> | T
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<T> | T> {
    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse<Response>();

    return (next.handle() as Observable<unknown>).pipe(
      map((data: unknown): SuccessResponse<T> | T => {
        // Bypass wrapping if response headers are already sent, or if data is a StreamableFile/stream
        if (
          data instanceof StreamableFile ||
          (data &&
            typeof (data as Record<string, unknown>).pipe === 'function') ||
          response.headersSent
        ) {
          return data as T;
        }

        return {
          success: true,
          data: data as T,
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }),
    );
  }
}
