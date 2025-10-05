"use client";
import PostCard from "./PostCard";
import { usePostsBrowseContext } from "@/providers/PostsBrowserProvider";
import PostPagination from "./PostPagination";
import { cn } from "@/lib/utils";
import { ListFilter, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";
import { useAuth } from "@/providers/AuthProvider";

export default function PostList() {
  const { items, setQ, setOrder, q, order } = usePostsBrowseContext();
  const { openForm } = useModal();
  const { is_logged_in } = useAuth();
  const hasFilter = () => {
    return q.length > 0 || order === "answered"
  }
  return (
    items.length > 0 ? (
      <div className="max-w-7xl w-full mb-5">
        <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4">
          {items.map(post => (
            <PostCard 
              key={post.id}
              data={post}
            />
          ))}
        </div>
        <PostPagination />
      </div>
    ) : (
      <div className="w-full my-10 px-3 sm:px-5 lg:px-10">
        <div
          className={cn(
            "mx-auto max-w-xl text-center rounded-xl border border-dashed border-zinc-300",
            "bg-white/70 p-8 sm:p-10 shadow-sm"
          )}
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100">
            <Search className="h-7 w-7 text-zinc-500" />
          </div>
          <h3 className="text-lg font-semibold text-zinc-800">
            Nenhuma postagem encontrada
          </h3>
          <p className="mt-1 text-sm text-zinc-600">
            {hasFilter() ? "Não encontramos resultados para a sua pesquisa atual. Tente ajustar os termos ou alterar os filtros." : 
            "Tá meio vazio por aqui… crie um post para começar!"}
          </p>
          {hasFilter() ?
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setOrder("recent")}
                className={cn(
                  "h-9 px-3 rounded-md flex items-center gap-2 cursor-pointer",
                  "bg-zinc-100 text-zinc-800 hover:bg-zinc-200 transition-colors"
                )}
                title="Limpar busca e filtros"
              >
              <ListFilter className="w-4 h-4" />
              <span>Limpar filtros</span>
              </button>
              <button
                onClick={() => setQ("")}
                className={cn(
                  "h-9 px-3 rounded-md flex items-center gap-2 cursor-pointer",
                  "bg-white border border-zinc-300 text-zinc-800 hover:bg-zinc-50 transition-colors"
                )}
                title="Limpar busca"
              >
                <Search className="w-4 h-4" />
                <span>Limpar busca</span>
              </button>
            </div>
            :
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
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
            </div>
          }
        </div>
      </div>
    )
  )
}