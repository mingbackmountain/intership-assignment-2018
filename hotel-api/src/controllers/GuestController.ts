import { Request, Response } from "express";
import { bookingService } from "../service/BookingService";
import { AuthorizationRequest } from "../features/authentication/application/interfaces/AuthorizationRequest";
import { transformAndValidate } from "class-transformer-validator";
import { GetGuestByFloor } from "../features/hotel/application/posts/GetGuestByFloor";
import { GetGuestByAge } from "../features/hotel/application/posts/GetGuestByAge";

export async function listGuest(request: Request, response: Response) {
  const hotelId = (request as AuthorizationRequest).$hotelId;
  const guests = await bookingService.listGuest(hotelId);

  response.json({ result: guests });
}

export async function listGuestByAge(request: Request, response: Response) {
  try {
    const { symbol, age } = (await transformAndValidate(
      GetGuestByAge,
      request.params
    )) as GetGuestByAge;
    const hotelId = (request as AuthorizationRequest).$hotelId;
    const guest = await bookingService.listGuestByAge(hotelId, symbol, age);

    response.json({ result: guest });
  } catch (error) {
    console.log(error);
    response.send(error.message);
  }
}

export async function listGuestByFloor(request: Request, response: Response) {
  try {
    const { floor } = (await transformAndValidate(
      GetGuestByFloor,
      request.params
    )) as GetGuestByFloor;
    const hotelId = (request as AuthorizationRequest).$hotelId;
    const guestByFloor = await bookingService.listGuestByFloor(hotelId, floor);

    response.json({ result: guestByFloor });
  } catch (error) {
    response.send(error.message);
  }
}
