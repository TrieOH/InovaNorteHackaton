import type { BasicTimestampI } from "./main-interfaces";

export interface UserGetI extends BasicTimestampI {
  id: string;
  email: string;
  name: string;
  username: string;
}
