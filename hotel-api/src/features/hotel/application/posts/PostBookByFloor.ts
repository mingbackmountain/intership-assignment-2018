import { IsString, IsInt, Min, Max } from "class-validator";

export class PostBookByFloor {
  @IsInt()
  floor: number;
  @IsString()
  guestName: string;
  @IsInt()
  @Min(1)
  @Max(200)
  guestAge: number;
}
