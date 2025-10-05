"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { PostGetI } from "@/types/post-interfaces";
import { useMainContent } from "./MainContentProvider";

type Order = "recent" | "relevant" | "answered";

type Ctx = {
  items: PostGetI[];
  total: number;
  totalPages: number;
  page: number;

  q: string;
  setQ: (v: string) => void;
  order: Order;
  setOrder: (v: Order) => void;

  setPage: (n: number) => void;
  nextPage: () => void;
  prevPage: () => void;
};

const PostsBrowseContext = createContext<Ctx | null>(null);

export function PostsBrowseProvider({
  pageSize = 10,
  prefetch = true,
  children,
}: {
  pageSize?: number;
  prefetch?: boolean;
  children: React.ReactNode;
}) {
  const {
    posts,
    // karma
    selectPostKarma, getPostKarma,
    // comments
    getAllCommentsFromPost, getCommentsForPost,
  } = useMainContent();

  const [q, setQ] = useState("");
  const [order, setOrder] = useState<Order>("recent");
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [q, order]);

  const norm = (s: string) =>
    (s || "")
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");

  const qNorm = norm(q);

  const filtered = useMemo(() => {
    if (!qNorm) return posts;
    return posts.filter((p) => {
      const inTitle = norm(p.title).includes(qNorm);
      const inContent = norm(p.content).includes(qNorm);
      return inTitle || inContent;
    });
  }, [posts, qNorm]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (order) {
      case "recent":
        arr.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
      case "relevant":
        arr.sort((a, b) => selectPostKarma(b.id) - selectPostKarma(a.id));
        break;
      case "answered":
        arr.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
        break;
    }
    return arr;
  }, [filtered, order, selectPostKarma]);

  const answeredFiltered = useMemo(() => {
    if (order !== "answered") return sorted;
    return sorted.filter((p) => {
      const comments = getCommentsForPost(p.id);
      return comments?.some((c) => c.is_answer === true);
    });
  }, [sorted, order, getCommentsForPost]);

  const total = answeredFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const items = answeredFiltered.slice(start, end);

  useEffect(() => {
    if (!prefetch || items.length === 0) return;
    if (order === "relevant") {
      Promise.allSettled(items.map((p) => getPostKarma(p.id)));
    }
    if (order === "answered") {
      Promise.allSettled(items.map((p) => getAllCommentsFromPost(p.id)));
    }
  }, [order, safePage, pageSize, items]);

  const value: Ctx = {
    items,
    total,
    totalPages,
    page: safePage,
    q, setQ,
    order, setOrder,
    setPage,
    nextPage: () => setPage((p) => Math.min(p + 1, totalPages)),
    prevPage: () => setPage((p) => Math.max(p - 1, 1)),
  };

  return (
    <PostsBrowseContext.Provider value={value}>
      {children}
    </PostsBrowseContext.Provider>
  );
}

export function usePostsBrowseContext() {
  const ctx = useContext(PostsBrowseContext);
  if (!ctx) throw new Error("usePostsBrowseContext must be used within PostsBrowseProvider");
  return ctx;
}
