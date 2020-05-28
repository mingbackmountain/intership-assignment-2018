import { Router } from "express";
import { register, signIn } from "../../../../controllers/AccountController";

export const accountRouter = Router();

accountRouter.post("/register", register);

accountRouter.post("/signIn", signIn);
