// Must be used inside of a dialog

import { DialogClose, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "../ui/label";
import { type PostCreationDataI, postCreationSchema } from "@/schemas/post-schema";
import { Textarea } from "../ui/textarea";

export default function PostFormComponent({
  mode,
  initial,
  onSubmit,
  onCancel,
}: {
  mode: "create" | "update";
  initial?: Partial<PostCreationDataI>;
  onSubmit: (v: PostCreationDataI) => void;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostCreationDataI>({
    resolver: zodResolver(postCreationSchema),
    defaultValues: initial
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
      <div className="grid gap-4 py-2 flex-1 content-start">
        <div className="grid gap-1">
          <Label htmlFor="post-title">Título da Postagem</Label>
          <Input id="post-title" {...register("title")} aria-invalid={!!errors.title} autoComplete="post-title"/>
          {errors.title && <p className="text-sm text-destructive">{String(errors.title.message)}</p>}
        </div>
        <div className="grid gap-1">
          <Label htmlFor="post-content">Conteúdo a ser Postado</Label>
          <Textarea id="post-content" {...register("content")} aria-invalid={!!errors.content} autoComplete="post-content" />
          {errors.content && <p className="text-sm text-destructive">{String(errors.content.message)}</p>}
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