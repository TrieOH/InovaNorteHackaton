import { BasicTimestampI } from "./main-interfaces";

export interface PostFormattedCardI {
  id: number;
  username: string;
  title: string;
  content_summary_text: string;
  comments_count: number;
  created_at: string;
}

export interface PostGetI extends BasicTimestampI {
  id: number;
  user_id: string;
  title: string;
  content: string;
}

export interface CommentGetI extends BasicTimestampI {
  id: number;
  post_id: number;
  user_id: string;
  is_child_of: number;
  content: string;
  is_answer: boolean;
}