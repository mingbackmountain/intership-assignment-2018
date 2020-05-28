import { IsString, IsInt, Min, Max } from "class-validator";
import { Sign } from "../../../../service/BookingService";
import { Transform } from "class-transformer";

export class GetGuestByAge {
  @IsString()
  symbol: Sign;
  @Transform(value => parseInt(value))
  @IsInt()
  @Min(1)
  @Max(200)
  age: number;
}
