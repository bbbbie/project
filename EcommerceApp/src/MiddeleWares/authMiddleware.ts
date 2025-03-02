// src/Middlewares/authMiddleware.ts
import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define the shape of the JWT payload
interface JwtPayload {
  id: string;
  role: string;
}

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Add user to the Request type
    }
  }
}

// Middleware to verify JWT token
export const verifyToken: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided or invalid format." });
    return;
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    req.user = decoded; // Attach the decoded user data (id and role) to the request
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
  }
};

// Middleware to check if the user is an admin
export const isAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required." });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Access denied. Admin role required." });
    return;
  }

  next();
};