import { ReadUserDto } from "modules/user/dto";

export default interface TokenOptions {
  user: ReadUserDto;
  expiresIn: string;
  type: string;
}