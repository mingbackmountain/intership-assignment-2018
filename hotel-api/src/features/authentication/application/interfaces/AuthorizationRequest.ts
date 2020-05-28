import { Request } from "express";

export interface AuthorizationRequest extends Request {
  $payload: { hotelId: string };
  $hotelId: string;
}
