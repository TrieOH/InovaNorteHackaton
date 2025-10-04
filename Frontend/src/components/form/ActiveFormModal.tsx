import type { ActiveForm } from "@/types/main-interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthTabsForm from "./AuthTabsForm";
import { cn } from "@/lib/utils";
import { handleCreateUser } from "@/actions/auth-actions";
import { toast } from "sonner";

export default function ActiveFormModal({ active, onClose }: 
  { active: ActiveForm; onClose: () => void }) {
  const open = Boolean(active);

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
            onSubmitRegister={async (values) => {
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
            }}
            onSubmitLogin={(values) => {
              console.log("Auth Register submit", values, active.mode);
              onClose();
            }}
          />
        )}

        {/* {active?.key === "post" && (
          <PostFormComponent
            mode={active.mode}
            initial={active.data}
            onCancel={onClose}
            onSubmit={(values) => {
              console.log("Post submit", values, active.mode);
              onClose();
            }}
          />
        )} */}
      </DialogContent>
    </Dialog>
  );
}
