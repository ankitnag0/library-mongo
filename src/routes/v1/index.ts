import { Router } from "express";
import bookRouter from "./book.router";
import memberRouter from "./member.router";
import checkoutRouter from "./checkout.router";

const router = Router();

router.use("/members", memberRouter);
router.use("/books", bookRouter);
router.use("/checkouts", checkoutRouter);

export default router;
