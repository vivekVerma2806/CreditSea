import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { Role } from '../models/User';

export const authorize = (roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (req.user.role === Role.Admin || roles.includes(req.user.role as Role)) {
      next();
    } else {
      res.status(403).json({ message: 'Access denied' });
      return;
    }
  };
};
