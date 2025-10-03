import z from "zod";

export const postCreationSchema = z.object({
  title: z.string().min(6, "O título deve ter pelo menos 6 caracteres"),
  content: z.string().min(20, "O Conteúdo deve ter pelo menos 20 caracteres"),
});

export type PostCreationDataI = z.infer<typeof postCreationSchema>;