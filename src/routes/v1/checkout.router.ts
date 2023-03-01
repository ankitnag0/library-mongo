import { Router } from "express";
import {
  checkoutBook,
  returnBook,
} from "../../controllers/checkout.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const checkoutRouter = Router();

checkoutRouter.get("/checkout/:bookId", authMiddleware, checkoutBook);
checkoutRouter.get("/return/:checkoutId", authMiddleware, returnBook);

export default checkoutRouter;
