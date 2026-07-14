export interface ApiMeta {
  timestamp: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any[];
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
  meta: ApiMeta;
}
