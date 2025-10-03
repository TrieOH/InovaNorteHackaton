"use client";
import { ListFilter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useState } from "react";

export default function FilterDropdownMenu() {
  const [filter, setFilter] = useState("recents")
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="p-1.5 active:scale-95 rounded-md border border-input cursor-pointer">
        <ListFilter size={34} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
          <DropdownMenuRadioItem value="recents">Mais Recentes</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="relevants">Mais Relevantes</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}