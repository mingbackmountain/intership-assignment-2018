import express from "express";
import { roomRouter } from "./features/hotel/application/routers/roomRouter";
import { guestRouter } from "./features/hotel/application/routers/guestRouter";
import { accountRouter } from "./features/authentication/application/routers/accountRouter";

export const app = express();

app.use(express.json());

app.use("/auth", accountRouter);
app.use("/rooms", roomRouter);
app.use("/guests", guestRouter);
