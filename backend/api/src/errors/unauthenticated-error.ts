import { CustomError } from './custom-error';

export class UnAuthenticatedError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Unauthenticated');
    Object.setPrototypeOf(this, UnAuthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unauthenticated' }];
  }
}
