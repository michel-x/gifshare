import { Request, Response, NextFunction } from 'express';
import { UnAuthenticatedError } from '../errors/unauthenticated-error';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnAuthenticatedError();
  }

  next();
};
