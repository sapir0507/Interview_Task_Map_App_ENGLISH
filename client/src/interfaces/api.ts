import type { ResponseStatus } from '../enums/responseStatus';

/** The envelope every server response uses (the server's Response<T>). */
export interface ApiResponse<T> {
  isSuccess: boolean;
  status: ResponseStatus;
  error: string;
  result: T[];
}

/** What a failed call rejects with. */
export interface ApiError {
  message: string;
  status: number | string;
}
