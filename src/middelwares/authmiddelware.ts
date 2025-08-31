import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { _id: string; role: string };
}

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization header missing or malformed" });
  }
  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      _id?: string; id?: string; role: string;
    };

    const userId = decoded._id || decoded.id; 
    if (!userId) return res.status(401).json({ message: "Token missing user ID" });

    req.user = { _id: userId, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You are not authorized to access this resource" });
    }
    next();
  };
};












// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export interface AuthRequest extends Request {
//   user?: { _id: string; role: string };
// }

// export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     const authHeader = req.headers.authorization;
//     const token = authHeader && authHeader.startsWith("Bearer ")
//       ? authHeader.split(" ")[1]
//       : req.cookies?.token;

//     if (!token) return res.status(401).json({ message: "Authorization token missing" });

//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");
//     const userId = decoded.id || decoded._id;
//     if (!userId) return res.status(401).json({ message: "Invalid token payload" });

//     req.user = { _id: userId, role: decoded.role };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Invalid or expired token" });
//   }
// };

// export const authorizeRoles = (...roles: string[]) => {
//   return (req: AuthRequest, res: Response, next: NextFunction) => {
//     if (!req.user) return res.status(401).json({ message: "Not authenticated" });
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "You are not authorized to access this resource" });
//     }
//     next();
//   };
// };
