import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import mongoose from "mongoose";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode: number;
  let message: string;

  if (err instanceof ApiError) {
    // Handle API errors
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof mongoose.Error.ValidationError) {
    // Handle Mongoose validation errors
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  } else {
    // Handle all other errors
    console.log(err);
    statusCode = 500;
    message = "Something went wrong";
  }

  return res.status(statusCode).send({
    success: false,
    message,
  });
};
