import { IsInt, IsString, IsEmail, Min, Max, Length } from "class-validator";

export class PostHotels {
  @IsInt()
  @Min(1)
  @Max(10)
  floor: number;
  @IsInt()
  @Min(1)
  @Max(10)
  roomPerFloor: number;
  @IsEmail()
  email: string;
  @IsString()
  @Length(8)
  password: string;
}
