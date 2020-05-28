import { IsString, IsInt, Min, Max } from "class-validator";

export class PostRoomBook {
  @IsString()
  roomNo: string;
  @IsString()
  guestName: string;
  @IsInt()
  @Min(1)
  @Max(200)
  guestAge: number;
}
