import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, `${process.env.ACCESS_TOKEN_SECRET}`, (err, user: any) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  });
};

export default verifyToken;
