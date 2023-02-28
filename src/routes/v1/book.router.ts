import { Router } from "express";
import { addBook } from "../../controllers/book.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const bookRouter = Router();

bookRouter.post("/", authMiddleware, addBook);

export default bookRouter;
