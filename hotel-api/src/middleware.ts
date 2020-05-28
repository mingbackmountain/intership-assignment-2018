import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { NextFunction } from "connect";

export function needAuthorization(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const secretKey = process.env.APP_KEY;
    const [_, token] = request.headers.authorization!.split(" ");
    const payload = jwt.verify(token, secretKey!);

    (request as any).$payload = payload;

    next();
  } catch (err) {
    response.status(401).json({
      error: err.message
    });
  }
}

export function withHotelId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  (request as any).$hotelId = (request as any).$payload.hotelId;

  next();
}
