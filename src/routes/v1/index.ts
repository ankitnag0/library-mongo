import { Router } from "express";
import bookRouter from "./book.router";
import memberRouter from "./member.router";

const router = Router();

router.use("/members", memberRouter);
router.use("/books", bookRouter);

export default router;
