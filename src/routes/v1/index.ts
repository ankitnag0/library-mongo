import { Router } from "express";
import memberRouter from "./member.router";

const router = Router();

router.use("/members", memberRouter);

export default router;
