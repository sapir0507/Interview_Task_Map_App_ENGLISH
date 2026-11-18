import type { ApiError } from '../interfaces/api';

const FALLBACK = 'Something went wrong. Please try again.';

/** A readable message for anything a failed call rejects with. */
export function toErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const { message } = error as Partial<ApiError>;
    if (typeof message === 'string' && message.length > 0) return message;
  }
  return FALLBACK;
}
