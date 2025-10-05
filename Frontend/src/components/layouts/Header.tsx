"use client";

import { BotMessageSquare, LogIn, LogOut, Menu, Plus, Search, X } from "lucide-react";
import { InputWithIcon } from "../ui/input-with-icon";
import FilterDropdownMenu from "./FilterDropwnMenu";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { clearAuthTokens } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { usePostsBrowseContext } from "@/providers/PostsBrowserProvider";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { q, setQ } = usePostsBrowseContext();
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
    <nav className="sticky z-20 top-0 left-0">
      <div className={cn(
        "w-full flex items-center justify-between",
        "min-h-14",
        "py-2 px-6 bg-background border-b-2 border-border"
      )}>
        <Link className="flex items-center gap-3 text-primary" href="/">
          <BotMessageSquare size={48} />
          <span className="font-bold text-2xl">SiConn</span>
        </Link>

        {/* Desktop */}
        <div className="items-center gap-3 md:flex hidden">
          <InputWithIcon
            value={q}
            onChange={(e) => setQ(e.target.value)}
            icon={<Search size={24}/>}
            className="lg:w-64 w-48"
            placeholder="Pesquisar..."
          />
          <FilterDropdownMenu />
        </div>

        {/* Desktop */}
        <div className="items-center gap-4 md:flex hidden">
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

        {/* Mobile Button */}
        { isMobileMenuOpen ?
          <X className="md:hidden flex cursor-pointer" size={32} onClick={() => setIsMobileMenuOpen(false)} /> 
          : <Menu className="md:hidden flex cursor-pointer" size={32} onClick={() => setIsMobileMenuOpen(true)} /> 
        }
      </div>
      {/* Mobile */}
      <div className={cn(
        "absolute w-full flex flex-col items-center px-6 py-4 bg-background ",
        "md:hidden flex gap-4 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]",
        !isMobileMenuOpen && "hidden",
      )}>
        <div className="flex items-center gap-3">
          <InputWithIcon 
            value={q}
            onChange={(e) => setQ(e.target.value)}
            icon={<Search size={24}/>} 
            placeholder="Pesquisar..."
          />
          <FilterDropdownMenu />
        </div>
        {/* It's not ideal, but for now it's okay..... */}
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
      </div>
    </nav>
  )
}