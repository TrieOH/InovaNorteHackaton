import { BotMessageSquare, ListFilter, LogIn, Plus, Search } from "lucide-react";
import { InputWithIcon } from "../ui/input-with-icon";
import FilterDropdownMenu from "./FilterDropwnMenu";
import { Button } from "../ui/button";

export function Header() {
  return (
    <header className="w-full flex items-center justify-between py-2 px-6 bg-background border-b-2 border-border">
      <div className="flex items-center gap-3 text-primary">
        <BotMessageSquare size={48} />
        <span className="font-bold text-2xl">MegaBot</span>
      </div>
      <div className="flex items-center gap-3">
        <InputWithIcon icon={<Search size={24}/>} className="min-w-64" placeholder="Pesquisar..."/>
        <FilterDropdownMenu />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" className="p-0 overflow-clip pl-4">
          Nova Postagem 
          <div className="bg-primary h-full w-9 flex justify-center items-center ml-1">
            <Plus className="text-background" />
          </div>
        </Button>
        <Button variant="outline" className="p-0 overflow-clip pl-4 border-secondary hover:bg-secondary">
          Entrar
          <div className="bg-secondary h-full w-9 flex justify-center items-center ml-1">
            <LogIn className="text-background" />
          </div>
        </Button>
      </div>
    </header>
  )
}