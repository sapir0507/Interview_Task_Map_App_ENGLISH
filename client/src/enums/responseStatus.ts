/** Outcome of an API call. The values are the names of the server's ResponseStatus enum. */
export const ResponseStatus = {
  OK: 'OK',
  BadRequest: 'BadRequest',
  NotFound: 'NotFound',
  InternalServerError: 'InternalServerError',
} as const;

export type ResponseStatus = (typeof ResponseStatus)[keyof typeof ResponseStatus];
