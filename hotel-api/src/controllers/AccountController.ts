import { Request, Response } from "express";
import { bookingService } from "../service/BookingService";
import jwt from "jsonwebtoken";
import { transformAndValidate } from "class-transformer-validator";
import { PostHotels } from "../features/authentication/application/posts/PostHotels";
import { PostSignIn } from "../features/authentication/application/posts/PostSignIn";

const secretKey = process.env.APP_KEY;

export async function register(request: Request, response: Response) {
  try {
    const {
      floor,
      roomPerFloor,
      email,
      password
    } = (await transformAndValidate(PostHotels, request.body)) as PostHotels;

    const hotel = await bookingService.createHotel(
      floor,
      roomPerFloor,
      email,
      password
    );
    const token = jwt.sign(
      {
        hotelId: hotel
      },
      secretKey!,
      { algorithm: "HS256", expiresIn: "1h", issuer: "Hotel" }
    );

    response.json({ result: token });
  } catch (error) {
    response.status(500).json(error);
  }
}

export async function signIn(request: Request, response: Response) {
  try {
    const { email, password } = (await transformAndValidate(
      PostSignIn,
      request.body
    )) as PostSignIn;

    const user = await bookingService.findUser(email, password);
    const token = jwt.sign(
      {
        userId: user.id
      },
      secretKey!,
      { algorithm: "HS256", expiresIn: "1h", issuer: "Hotel" }
    );

    response.json({ result: token });
  } catch (error) {
    response.status(500).json(error);
  }
}
