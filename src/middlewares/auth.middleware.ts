import { Request, Response, NextFunction } from "express";
import Member from "../models/member.model";
import jwt from "jsonwebtoken";

// Middleware to authenticate a member using JWT
export const authenticateMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const decoded: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    const member = await Member.findById(decoded.id);

    if (!member) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    req.member = member;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
};
