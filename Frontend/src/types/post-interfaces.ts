import type { BasicTimestampI } from "./main-interfaces";

export interface PostGetI extends BasicTimestampI {
  id: number;
  title: string;
  content: string;
  user_id: string;
}

export interface CommentGetI extends BasicTimestampI {
  id: number;
  post_id: number;
  user_id: string;
  is_child_of: number;
  content: string;
  is_answer: boolean;
}