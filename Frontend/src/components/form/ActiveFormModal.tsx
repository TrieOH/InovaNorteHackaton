import type { ActiveForm } from "@/types/main-interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthTabsForm from "./AuthTabsForm";
import { cn } from "@/lib/utils";
import { handleCreateUser, handleLoginUser } from "@/actions/auth-actions";
import { toast } from "sonner";
import type { UserCreationDataI, UserLoginDataI } from "@/schemas/user-schema";
import PostFormComponent from "./PostFormComponent";
import type { CommentCreationDataI, PostCreationDataI } from "@/schemas/post-schema";
import { useMainContent } from "@/providers/MainContentProvider";
import PostCommentFormComponent from "./PostCommentFormComponent";
import { useModal } from "@/providers/ModalProvider";

export default function ActiveFormModal({ active, onClose }: 
  { active: ActiveForm; onClose: () => void }) {
  const open = Boolean(active);
  const { postId, commentId } = useModal();
  const { createPost, createCommentOnPost } = useMainContent();

  const onSubmitLogin = async (values: UserLoginDataI) => {
    const res = await handleLoginUser(values);
    if(res.success) {
      toast("Usuário logado com sucesso!", {
        description: res.message,
        position: "bottom-right"
      })
      onClose();
    }
    else {
      toast(res.error, {
        description: res.trace,
        position: "bottom-right"
      })
    }
  }

  const onSubmitRegister = async (values: UserCreationDataI) => {
    const res = await handleCreateUser(values);
    if(res.success) {
      toast("Usuário cadastrado com sucesso!", {
        description: res.message,
        position: "bottom-right"
      })
      onClose();
    }
    else {
      toast(res.error, {
        description: res.trace,
        position: "bottom-right"
      })
    }
  }

  const onSubmitCreatePost = async (values: PostCreationDataI) => {
    const res = await createPost(values);
    if(res.success) {
      toast("Postagem criada com sucesso!", {
        description: res.message,
        position: "bottom-right"
      })
      onClose();
    }
    else {
      toast(res.error, {
        description: res.trace,
        position: "bottom-right"
      })
    }
  }

  const onSubmitCreateComment = async (values: CommentCreationDataI, comment_id: number | null, post_id: number) => {
    const res = await createCommentOnPost({...values, comment_id: comment_id, post_id: post_id});
    if(res.success) {
      toast("Comentário criado com sucesso!", {
        description: res.message,
        position: "bottom-right"
      })
      onClose();
    }
    else {
      toast(res.error, {
        description: res.trace,
        position: "bottom-right"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className={cn(
        "flex flex-col h-full",
        "sm:max-w-[560px] min-h-[80%] overflow-y-auto max-h-[90vh] content-start"
      )}>
        <DialogHeader>
          <DialogTitle>
            {active?.key === "auth-register" || active?.key === "auth-login"
              ? "Bem vindo" 
              : active?.key === "post"
              ? "Compartilhe seus conhecimentos"
              : ""}
          </DialogTitle>
          <DialogDescription>
            {active?.key === "auth-register" || active?.key === "auth-login"
              ? "Crie ou entre em sua conta para participar das discussões." 
              : active?.key === "post" ? "Oque quer escrever hoje?"
              : ""}
          </DialogDescription>
        </DialogHeader>

        {(active?.key === "auth-register" || active?.key === "auth-login") && (
          <AuthTabsForm
            onCancel={onClose}
            onSubmitRegister={values => onSubmitRegister(values)}
            onSubmitLogin={values => onSubmitLogin(values) }
          />
        )}

        {active?.key === "post" && (
          <PostFormComponent
            mode={active.mode}
            initial={active.data as PostCreationDataI}
            onCancel={onClose}
            onSubmit={(values) => onSubmitCreatePost(values)}
          />
        )}

        {active?.key === "comment" && (
          <PostCommentFormComponent
            mode={active.mode}
            initial={active.data as CommentCreationDataI}
            onCancel={onClose}
            onSubmit={(values) => postId.value && onSubmitCreateComment(values, commentId.value, postId.value)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
