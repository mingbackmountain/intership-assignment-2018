import { Router } from "express";
import {
  listGuest,
  listGuestByAge,
  listGuestByFloor
} from "../../../../controllers/GuestController";
import { needAuthorization, withHotelId } from "../../../../middleware";

export const guestRouter = Router();

guestRouter.use(needAuthorization, withHotelId);

guestRouter.get("/list_guest", listGuest);

guestRouter.get("/list_guest_by_age/:symbol/:age", listGuestByAge);

guestRouter.get("/:floor", listGuestByFloor);
