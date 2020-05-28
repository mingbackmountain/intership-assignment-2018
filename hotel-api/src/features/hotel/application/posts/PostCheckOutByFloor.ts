import { IsString, IsInt, Min, Max } from "class-validator";

export class PostCheckOutByFloor {
  @IsInt()
  floor: number;
}
