import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Use environment variable for secret
const secret = process.env.JWT_SECRET_ADMIN || "empmanagsys$123@&";

const restrictToLoggedinUserOnly: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.uid;

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return; 
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || !decoded.id) {
      res.status(401).json({ message: "Unauthorized: Invalid token payload" });
      return;
    }

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      adminName: decoded.adminName,
    };

    next(); 
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default restrictToLoggedinUserOnly;
