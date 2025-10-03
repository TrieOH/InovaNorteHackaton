import z from "zod";

export const userCreationSchema = z.object({
  name: z.string().min(6, "O nome deve ter pelo menos 6 caracteres"),
  username: z.string().min(2, "O Username deve ter pelo menos 2 caracteres"),
  email: z.email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirm_password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirm_password, {
    message: "As senhas não conferem",
    path: ["confirm_password"],
  }
);

export type UserCreationDataI = z.infer<typeof userCreationSchema>;

export const userLoginSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export type UserLoginDataI = z.infer<typeof userLoginSchema>;


// export type SignUpFormDataToSendI = Omit<
//   SignUpFormDataI,
//   "terms" | "confirm_password"
// >;