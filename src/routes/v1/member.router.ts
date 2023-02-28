import { Router } from "express";
import {
  loginMember,
  registerMember,
} from "../../controllers/member.controller";

const memberRouter = Router();

memberRouter.post("/", registerMember);
memberRouter.post("/login", loginMember);

export default memberRouter;
