"use client";

import { cn } from "@/lib/utils";
import { usePostsBrowseContext } from "@/providers/PostsBrowserProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PageButton from "./PageButton";

export default function PostPagination() {
  const { page, prevPage, setPage, nextPage, totalPages } = usePostsBrowseContext();

  const visiblePages = 5;
  const start = Math.max(1, page - Math.floor(visiblePages / 2));
  const end = Math.min(totalPages, start + visiblePages - 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex justify-center items-center gap-3 mt-12 select-none">
      <button 
        onClick={prevPage}
        disabled={page <= 1}
        className={cn(
          "rounded-full p-1 border border-primary shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]",
          "duration-500",
          page <= 1
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-background text-primary hover:bg-primary hover:text-background cursor-pointer"
        )}
      >
        <ChevronLeft size={40} />
      </button>

      <div className="flex items-center gap-2">
        {start > 1 && (
          <>
            <PageButton page={1} current={page} setPage={setPage} />
            {start > 2 && (
              <div className="w-10 h-10 flex items-center justify-center text-muted-foreground select-none">
                ...
              </div>
            )}
          </>
        )}

        {pages.map((p) => (
          <PageButton key={p} page={p} current={page} setPage={setPage} />
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-muted-foreground">...</span>}
            <PageButton page={totalPages} current={page} setPage={setPage} />
          </>
        )}
      </div>

      <button 
        onClick={nextPage}
        disabled={page >= totalPages}
        className={cn(
          "rounded-full p-1 border border-primary shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]",
          "duration-500",
          page >= totalPages
            ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
            : "bg-background text-primary hover:bg-primary hover:text-background cursor-pointer"
        )}
      >
        <ChevronRight size={40} />
      </button>
    </div>
  )
}