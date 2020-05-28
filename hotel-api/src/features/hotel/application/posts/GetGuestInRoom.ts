import { validate, IsString } from "class-validator";

export class GetGuestInRoom {
  @IsString()
  roomId: string;
}
