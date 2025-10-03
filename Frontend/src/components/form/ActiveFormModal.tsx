import type { ActiveForm } from "@/types/main-interfaces";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import AuthFormComponent from "./AuthFormComponent";
import type { UserCreationDataI } from "@/schemas/user-schema";

export default function ActiveFormModal({ active, onClose }: 
  { active: ActiveForm; onClose: () => void }) {
  const open = Boolean(active);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[560px] min-h-[80%]">
        <DialogHeader>
          <DialogTitle>
            {active?.key === "auth"
              ? "Bem vindo" 
              : active?.key === "post"
              ? "Compartilhe seus conhecimentos"
              : ""}
          </DialogTitle>
          <DialogDescription>
            {active?.key === "auth" ? 
              "Crie ou entre em sua conta para participar das discussões." 
              : active?.key === "post" ? "Oque quer escrever hoje?"
              : ""}
          </DialogDescription>
        </DialogHeader>

        {active?.key === "auth" && (
          <AuthFormComponent
            mode={active.mode}
            initial={active.data as UserCreationDataI}
            onCancel={onClose}
            onSubmit={(values) => {
              console.log("Auth submit", values, active.mode);
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
