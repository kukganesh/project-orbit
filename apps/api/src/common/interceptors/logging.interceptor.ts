import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
  HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  // NestJS built-in Logger delegates to the registered application logger.
  // If the app is configured to use Pino/Winston at bootstrap, this automatically routes there.
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<Request>();
    const response = httpContext.getResponse<Response>();

    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const statusCode = response.statusCode;
          const duration = Date.now() - startTime;
          this.logRequest(method, url, statusCode, duration);
        },
        error: (err: unknown) => {
          const statusCode =
            err instanceof HttpException ? err.getStatus() : 500;
          const duration = Date.now() - startTime;
          this.logRequest(method, url, statusCode, duration, err);
        },
      }),
    );
  }

  /**
   * Centralized helper for HTTP request logging.
   * Modifying this method allows shifting to structured JSON, Winston/Pino, or APM exports in the future.
   */
  private logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    error?: unknown,
  ) {
    const timestamp = new Date().toISOString();
    const logMsg = `[${timestamp}] ${method} ${url} ${statusCode} - ${duration}ms`;

    if (error) {
      let errMsg = '';
      if (error instanceof Error) {
        errMsg = error.message;
      } else if (typeof error === 'string') {
        errMsg = error;
      } else {
        errMsg = JSON.stringify(error);
      }
      this.logger.error(`${logMsg} - Error: ${errMsg}`);
    } else {
      this.logger.log(logMsg);
    }
  }
}
