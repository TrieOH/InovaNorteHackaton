import type { CommentCreationDataI, PostCreationDataI } from "@/schemas/post-schema";
import type { UserCreationDataI } from "@/schemas/user-schema";
import type { Dispatch, SetStateAction } from "react";

export interface BasicTimestampI {
  created_at: string;
  updated_at: string;
}

export type FormMode = "create" | "update";
export type FormKey = "auth-login" | "auth-register" | "post" | "comment";

export type FormDataMap = {
  "auth-register": UserCreationDataI;
  "auth-login": UserCreationDataI;
  comment: CommentCreationDataI;
  post: PostCreationDataI;
};

export type ActiveForm<K extends FormKey = FormKey> = {
  key: K;
  mode: FormMode;
  data?: FormDataMap[K];
} | null;

export type ModalContextValue = {
  openForm: <K extends FormKey>(
    key: K,
    mode?: FormMode,
    data?: FormDataMap[K]
  ) => void;
  closeForm: () => void;
  postId: {value: number | null, setValue: Dispatch<SetStateAction<number | null>>}
  commentId: {value: number | null, setValue: Dispatch<SetStateAction<number | null>>}
};