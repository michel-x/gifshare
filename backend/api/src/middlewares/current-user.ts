import { Request, Response, NextFunction } from 'express';
import { DecodedIdToken } from 'firebase-admin/auth';
import { auth } from '../services/firebase';


declare global {
  namespace Express {
    interface Request {
      currentUser?: DecodedIdToken;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const user = await auth.verifyIdToken(token);
      req.currentUser = user;
    } catch (error) {
      
    }
  }

  return next();
};
