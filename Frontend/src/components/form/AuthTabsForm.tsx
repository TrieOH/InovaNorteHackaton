import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userCreationSchema, type UserLoginDataI, userLoginSchema, type UserCreationDataI } from "@/schemas/user-schema"
import { DialogClose, DialogFooter } from "../ui/dialog"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function AuthTabsForm({
  onSubmitRegister,
  onSubmitLogin,
  onCancel,
}: {
  onSubmitRegister: (v: UserCreationDataI) => void
  onSubmitLogin: (v: UserLoginDataI) => void
  onCancel: () => void
}) {
  const { 
    register: registerR, 
    handleSubmit: handleSubmitR, 
    formState: { errors: errorsR, isSubmitting: isSubmittingR } 
  } =
    useForm<UserCreationDataI>({
      resolver: zodResolver(userCreationSchema),
    })

  const { 
    register: registerL, 
    handleSubmit: handleSubmitL, 
    formState: { errors: errorsL, isSubmitting: isSubmittingL } 
  } =
    useForm<UserLoginDataI>({
      resolver: zodResolver(userLoginSchema),
    })

  return (
    <Tabs defaultValue="login" className="w-full h-full">
      <TabsList className="grid grid-cols-2 w-full mb-2">
        <TabsTrigger className="rounded-none rounded-l-lg" value="login">Entrar</TabsTrigger>
        <TabsTrigger className="rounded-none rounded-r-lg" value="register">Cadastrar</TabsTrigger>
      </TabsList>

      {/* TABS LOGIN */}
      <TabsContent value="login">
        <form onSubmit={handleSubmitL(onSubmitLogin)} className="h-full flex flex-col">
          <div className="grid gap-4 py-2 flex-1 content-start">
            <div className="grid gap-1">
              <Label htmlFor="username">E-mail</Label>
              <Input id="email" {...registerL("email")} aria-invalid={!!errorsL.email} autoComplete="email" />
              {errorsL.email && (
                <p className="text-sm text-destructive">{String(errorsL.email.message)}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" {...registerL("password")} aria-invalid={!!errorsL.password} autoComplete="current-password" />
              {errorsL.password && (
                <p className="text-sm text-destructive">{String(errorsL.password.message)}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel} type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button disabled={isSubmittingL} type="submit">
              Entrar
            </Button>
          </DialogFooter>
        </form>
      </TabsContent>

      {/* -------- TAB REGISTER -------- */}
      <TabsContent value="register">
        <form onSubmit={handleSubmitR(onSubmitRegister)} className="h-full flex flex-col">
          <div className="grid gap-4 py-2 flex-1 content-start">
            <div className="grid gap-1">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" {...registerR("name")} aria-invalid={!!errorsR.name} autoComplete="name"/>
              {errorsR.name && <p className="text-sm text-destructive">{String(errorsR.name.message)}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...registerR("username")} aria-invalid={!!errorsR.username} autoComplete="username" />
              {errorsR.username && <p className="text-sm text-destructive">{String(errorsR.username.message)}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" {...registerR("email")} aria-invalid={!!errorsR.email} autoComplete="email" />
              {errorsR.email && <p className="text-sm text-destructive">{String(errorsR.email.message)}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" {...registerR("password")} aria-invalid={!!errorsR.password} autoComplete="new-password" />
              {errorsR.password && <p className="text-sm text-destructive">{String(errorsR.password.message)}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="confirm_password">Confirme a Senha</Label>
              <Input type="password" id="confirm_password" {...registerR("confirm_password")} aria-invalid={!!errorsR.confirm_password} autoComplete="confirm_password" />
              {errorsR.confirm_password && (
                <p className="text-sm text-destructive">{String(errorsR.confirm_password.message)}</p>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline" onClick={onCancel} type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button disabled={isSubmittingR} type="submit">
              Cadastrar
            </Button>
          </DialogFooter>
        </form>
      </TabsContent>
    </Tabs>
  )
}
