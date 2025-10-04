"use client";

import { BotMessageSquare, LogIn, LogOut, Plus, Search } from "lucide-react";
import { InputWithIcon } from "../ui/input-with-icon";
import FilterDropdownMenu from "./FilterDropwnMenu";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { clearAuthTokens } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Header() {
  const { openForm } = useModal();
  const { is_logged_in } = useAuth();
  const router = useRouter();

  const handleLogoutAction = async () => {
    await clearAuthTokens();
    router.refresh();
    toast("Usuário deslogado com sucesso!", {
      position: "bottom-right"
    });
  }
  return (
    <header className="fixed z-10 top-0 left-0 w-full flex items-center justify-between py-2 px-6 bg-background border-b-2 border-border">
      <Link className="flex items-center gap-3 text-primary" href="/">
        <BotMessageSquare size={48} />
        <span className="font-bold text-2xl">SiConn</span>
      </Link>
      <div className="flex items-center gap-3">
        <InputWithIcon icon={<Search size={24}/>} className="min-w-64" placeholder="Pesquisar..."/>
        <FilterDropdownMenu />
      </div>
      <div className="flex items-center gap-4">
        <Button 
          onClick={() => openForm("post")}
          variant="outline" 
          disabled={!is_logged_in}
          className="p-0 overflow-clip pl-4"
        >
          Nova Postagem 
          <div className="bg-primary h-full w-9 flex justify-center items-center ml-1">
            <Plus className="text-background" />
          </div>
        </Button>
        {
          is_logged_in ? (
            <Button 
              onClick={handleLogoutAction}
              variant="outline" 
              className="p-0 overflow-clip pl-4 border-secondary hover:bg-secondary"
            >
              Deslogar
              <div className="bg-secondary h-full w-9 flex justify-center items-center ml-1">
                <LogOut className="text-background" />
              </div>
            </Button>
          ) : (
            <Button 
              onClick={() => openForm("auth-login")}
              variant="outline" 
              className="p-0 overflow-clip pl-4 border-secondary hover:bg-secondary"
            >
              Entrar
              <div className="bg-secondary h-full w-9 flex justify-center items-center ml-1">
                <LogIn className="text-background" />
              </div>
            </Button>
          )
        }
      </div>
    </header>
  )
}