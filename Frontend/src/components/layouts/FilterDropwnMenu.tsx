"use client";
import { ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { usePostsBrowseContext } from "@/providers/PostsBrowserProvider";

export default function FilterDropdownMenu() {
  const { order, setOrder } = usePostsBrowseContext();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="p-1.5 active:scale-95 rounded-md border border-input cursor-pointer">
        <ListFilter size={34} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup 
          value={order} 
          onValueChange={(value) => setOrder(value as "recent" | "relevant" | "answered")}
        >
          <DropdownMenuRadioItem value="recent">Mais Recentes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="relevant">Mais Relevantes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="answered">Respondidos</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}