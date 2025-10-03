import type { PostCreationDataI } from "@/schemas/post-schema";
import type { UserCreationDataI } from "@/schemas/user-schema";

export interface BasicTimestampI {
  created_at: string;
  updated_at: string;
}

export type FormMode = "create" | "update";
export type FormKey = "auth" | "post";

export type FormDataMap = {
  auth: UserCreationDataI;
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
};