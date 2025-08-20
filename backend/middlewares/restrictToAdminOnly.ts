import { Request, Response, NextFunction } from 'express';

const restrictToAdminOnly = (req: Request, res: Response, next: NextFunction): void => {
  const user = (req as any).user;

  if (!user || user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
    return;
  }

  next();
};

export default restrictToAdminOnly;
