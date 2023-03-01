import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";

export const notFoundMiddleware = (req: Request, res: Response) => {
  throw new ApiError(404, "Route does not exist");
};
