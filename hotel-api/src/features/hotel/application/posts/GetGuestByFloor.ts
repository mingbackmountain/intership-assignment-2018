import { IsString } from "class-validator";

export class GetGuestByFloor {
  @IsString()
  floor: string;
}
