import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';
    let details: any[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const resContent = exception.getResponse();

      if (typeof resContent === 'object' && resContent !== null) {
        const exceptionResponse = resContent as Record<string, unknown>;
        const resMessage = exceptionResponse.message;
        const resDetails = exceptionResponse.details;

        // Check for NestJS ValidationPipe arrays of error messages
        if (Array.isArray(resMessage)) {
          code = 'VALIDATION_ERROR';
          message = 'Validation failed';
          details = resMessage;
        } else {
          message =
            typeof resMessage === 'string' ? resMessage : exception.message;
          code = this.getErrorCode(status);
          details = Array.isArray(resDetails) ? resDetails : [];
        }
      } else {
        message = exception.message || String(resContent);
        code = this.getErrorCode(status);
      }
    } else {
      // Non-HttpException (e.g. database error, syntax error, etc.)
      const error = exception as Error;
      this.logger.error(
        `Unhandled exception: ${error?.message || String(exception)}`,
        error?.stack,
      );
      // Clean sanitized message to prevent leakage of internal database or provider secrets
      message = 'An unexpected error occurred. Please try again later.';
      code = 'INTERNAL_SERVER_ERROR';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };

    response.status(status).json(errorResponse);
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'BAD_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 500:
        return 'INTERNAL_SERVER_ERROR';
      default:
        return HttpStatus[status] || 'HTTP_EXCEPTION';
    }
  }
}
