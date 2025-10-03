// Must be used inside of a dialog

import { userCreationSchema, type UserCreationDataI } from "@/schemas/user-schema";
import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";

export default function AuthFormComponent({
  mode,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "update";
  onSubmit: (v: UserCreationDataI) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserCreationDataI>({
    resolver: zodResolver(userCreationSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-2">
        <div className="grid gap-1">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="username">Username</Label>
          <Input id="username" {...register("username")} aria-invalid={!!errors.username} />
          {errors.username && <p className="text-sm text-destructive">{String(errors.username.message)}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" {...register("email")} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-sm text-destructive">{String(errors.email.message)}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" {...register("password")} aria-invalid={!!errors.password} />
          {errors.password && <p className="text-sm text-destructive">{String(errors.password.message)}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="confirm_password">Confirme a sua Senha</Label>
          <Input id="confirm_password" {...register("confirm_password")} aria-invalid={!!errors.confirm_password} />
          {errors.confirm_password && <p className="text-sm text-destructive">{String(errors.confirm_password.message)}</p>}
        </div>
      </div>
      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
        </DialogClose>
        <Button disabled={isSubmitting} type="submit">
          {mode === "create" ? "Criar" : "Atualizar"}
        </Button>
      </DialogFooter>
    </form>
  );
}