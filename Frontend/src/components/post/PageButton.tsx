import { cn } from "@/lib/utils";

export default function PageButton({ page, current, setPage }: { page: number; current: number; setPage: (n: number) => void }) {
  const isActive = page === current;
  return (
    <button
      onClick={() => setPage(page)}
      className={cn(
        "w-10 h-10 flex items-center justify-center rounded-full cursor-pointer",
        "border border-primary text-sm font-medium duration-500",
        isActive
          ? "bg-primary text-background cursor-default"
          : "bg-background text-primary hover:bg-primary hover:text-background"
      )}
    >
      {page}
    </button>
  );
}