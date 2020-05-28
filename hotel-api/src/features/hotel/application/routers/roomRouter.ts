import { Router } from "express";
import {
  book,
  checkout,
  bookByFloor,
  checkOutByFloor,
  availableRooms,
  getGuestInRoom
} from "../../../../controllers/RoomController";

import { needAuthorization, withHotelId } from "../../../../middleware";

export const roomRouter = Router();

roomRouter.use(needAuthorization, withHotelId);

roomRouter.post("/book", book);

roomRouter.post("/checkout", checkout);

roomRouter.post("/book_by_floor", bookByFloor);

roomRouter.post("/checkout_by_floor", checkOutByFloor);

roomRouter.get("/available_rooms", availableRooms);

roomRouter.get("/:roomId", getGuestInRoom);
