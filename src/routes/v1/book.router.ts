import { Router } from "express";
import {
  addBook,
  deleteBook,
  getBook,
  getBooks,
  getSortedBooks,
  updateBook,
} from "../../controllers/book.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const bookRouter = Router();

bookRouter.post("/", authMiddleware, addBook);
bookRouter.get("/", authMiddleware, getBooks);
bookRouter.get("/sorted/books", authMiddleware, getSortedBooks);
bookRouter.get("/:id", authMiddleware, getBook);
bookRouter.put("/:id", authMiddleware, updateBook);
bookRouter.delete("/:id", authMiddleware, deleteBook);

export default bookRouter;
