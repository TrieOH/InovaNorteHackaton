import { BotMessageSquare, Search } from "lucide-react";
import { InputWithIcon } from "../ui/input-with-icon";

export function Header() {
  return (
    <header className="w-full flex items-center justify-between py-2 px-6 bg-background border-b-2 border-border">
      <div className="flex items-center gap-3 text-primary">
        <BotMessageSquare size={48} />
        <span className="font-bold text-2xl">MegaBot</span>
      </div>
      <div className="flex items-center gap-3">
        <InputWithIcon icon={<Search size={24}/>} className="min-w-64" placeholder="Pesquisar..."/>
      </div>
      <div>
        
      </div>
    </header>
  )
}