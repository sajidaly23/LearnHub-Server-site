// middelwares/authmiddelware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extends the Request type to include a user object
export interface AuthRequest extends Request {
  user?: { _id: string; role: string };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }

  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { _id?: string; id?: string; role: string };
console.log("Decoded Token:", decoded);

const userId = decoded._id || decoded.id; // fallback agar `_id` nahi to `id`
if (!userId) {
  return res.status(401).json({ message: "Token missing user ID" });
}

req.user = { _id: userId, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

//  Role authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }

    next();
  };
};
