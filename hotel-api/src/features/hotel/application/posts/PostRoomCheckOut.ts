import { IsString, IsInt } from "class-validator";

export class PostRoomCheckOut {
  @IsInt()
  keyCardNo: number;
  @IsString()
  guestName: string;
}
