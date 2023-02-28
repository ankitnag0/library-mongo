import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import Member from "../models/member.model"; // import the Member model
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

interface TokenPayload {
  _id: string;
}

declare global {
  namespace Express {
    interface Request {
      member?: mongoose.Document;
    }
  }
}

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, "No token provided");
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    throw new ApiError(401, "Token error");
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    throw new ApiError(401, "Token malformatted");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    const member = await Member.findById(decoded._id);

    if (!member) {
      throw new ApiError(401, "Member not found");
    }

    req.member = member;

    return next();
  } catch (err) {
    throw new ApiError(401, "Token invalid");
  }
}

export default authMiddleware;
