import { Request, Response } from "express";
import { bookingService } from "../service/BookingService";
import { Guest } from "../features/hotel/domain/entities/Guest";
import { AuthorizationRequest } from "../features/authentication/application/interfaces/AuthorizationRequest";
import { transformAndValidate } from "class-transformer-validator";
import { GetGuestInRoom } from "../features/hotel/application/posts/GetGuestInRoom";
import { PostRoomBook } from "../features/hotel/application/posts/PostRoomBook";
import { PostRoomCheckOut } from "../features/hotel/application/posts/PostRoomCheckOut";
import { PostBookByFloor } from "../features/hotel/application/posts/PostBookByFloor";
import { PostCheckOutByFloor } from "../features/hotel/application/posts/PostCheckOutByFloor";

export async function book(request: Request, response: Response) {
  const { roomNo, guestName, guestAge } = (await transformAndValidate(
    PostRoomBook,
    request.body
  )) as PostRoomBook;
  const guest = new Guest(guestName, guestAge);
  const hotelId = (request as AuthorizationRequest).$hotelId;

  try {
    const confirmationInfo = await bookingService.bookAndCheckIn(
      hotelId,
      roomNo,
      guest
    );

    response.json({ result: confirmationInfo });
  } catch (error) {
    response.send(error.message);
  }
}

export async function checkout(request: Request, response: Response) {
  try {
    const { keyCardNo, guestName } = (await transformAndValidate(
      PostRoomCheckOut,
      request.body
    )) as PostRoomCheckOut;
    const hotelId = (request as AuthorizationRequest).$hotelId;
    const room = await bookingService.checkOutRoom(
      hotelId,
      guestName,
      keyCardNo
    );

    response.json({ result: room });
  } catch (error) {
    response.send(error.message);
  }
}

export async function bookByFloor(request: Request, response: Response) {
  try {
    const { floor, guestName, guestAge } = (await transformAndValidate(
      PostBookByFloor,
      request.body
    )) as PostBookByFloor;
    const hotelId = (request as AuthorizationRequest).$hotelId;
    const guest = new Guest(guestName, guestAge);
    const confirmationInfo = await bookingService.bookByFloorAndCheckIn(
      hotelId,
      floor,
      guest
    );

    response.json({ result: confirmationInfo });
  } catch (error) {
    console.log(error);
    response.send(error.message);
  }
}

export async function checkOutByFloor(request: Request, response: Response) {
  try {
    const { floor } = (await transformAndValidate(
      PostCheckOutByFloor,
      request.body
    )) as PostCheckOutByFloor;
    const hotelId = (request as AuthorizationRequest).$hotelId;
    const rooms = await bookingService.checkOutGuestByFloor(hotelId, floor);

    response.json({ result: rooms });
  } catch (error) {
    response.send(error.message);
  }
}

export async function availableRooms(request: Request, response: Response) {
  const hotelId = (request as AuthorizationRequest).$hotelId;
  const available_rooms = await bookingService.listAvailableRooms(hotelId);

  response.json({ result: available_rooms });
}

export async function getGuestInRoom(request: Request, response: Response) {
  try {
    const { roomId } = (await transformAndValidate(
      GetGuestInRoom,
      request.params
    )) as GetGuestInRoom;

    const hotelId = (request as AuthorizationRequest).$hotelId;
    const guest = await bookingService.getGuestInRoom(hotelId, roomId);

    response.json({ result: { name: guest.name } });
  } catch (error) {
    response.send(error.message);
  }
}
