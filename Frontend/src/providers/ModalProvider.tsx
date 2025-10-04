"use client";
import ActiveFormModal from "@/components/form/ActiveFormModal";
import type { ActiveForm, FormDataMap, FormKey, FormMode, ModalContextValue } from "@/types/main-interfaces";
import { createContext, type ReactNode, useContext, useState } from "react";

const ModalContext = createContext<ModalContextValue | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<ActiveForm>(null);
  const [postId, setPostId] = useState<number | null>(null);
  const [commentId, setCommentId] = useState<number | null>(null);

  function openForm<K extends FormKey>(
    key: K,
    mode: FormMode = "create",
    data?: FormDataMap[K]
  ) {
    setActive({ key, mode, data });
  }

  function closeForm() {
    setActive(null);
    setPostId(null);
    setCommentId(null);
  }

  return (
    <ModalContext.Provider 
      value={{ 
        openForm, 
        closeForm, 
        postId:{value: postId, setValue: setPostId},
        commentId:{value: commentId, setValue: setCommentId}
      }}
    >
      {children}
      <ActiveFormModal active={active} onClose={closeForm} />
    </ModalContext.Provider>
  );
}

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};