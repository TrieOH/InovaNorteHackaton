import type { BasicTimestampI } from "./main-interfaces";

export interface UserGetI extends BasicTimestampI {
  id: number;
  email: string;
  name: string;
  username: string;
}
