import { IsInt, IsString } from "class-validator";

export class PostSignIn {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
