"use client";
import { timeAgo } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { useMainContent } from "@/providers/MainContentProvider";
import type { PostGetI } from "@/types/post-interfaces";
import { ChevronDown, ChevronUp, MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

interface PostI {
  data: PostGetI
}

export default function PostCard(props: PostI) {
  const { 
    getUserById, 
    getAllCommentsFromPost, 
    getCommentsForPost,

    getPostKarma,
    selectPostKarma,
    voteOnPost,
  } = useMainContent();
  const user = getUserById(props.data.user_id);

  useEffect(() => { getAllCommentsFromPost(props.data.id); }, [props.data.id, getAllCommentsFromPost]);
  useEffect(() => {
    getPostKarma(props.data.id);
  }, [props.data.id, getPostKarma]);

  const comments = getCommentsForPost(props.data.id);
  const postKarma = selectPostKarma(props.data.id);

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/posts/${props.data.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado com sucesso!");
    } catch {
      toast.error("Falha ao copiar o link!");
    }
  };

  if(!user) return;

  return (
    <Link href={`/posts/${props.data.id}`} 
      className={cn(
        "flex gap-6 items-center",
        "w-full h-56 rounded-md px-5 py-2.5 cursor-pointer duration-500",
        "border-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-primary/50 hover:border-primary hover:scale-[102%]"
      )}
    >
      {/* Feedback */}
      <div className="flex flex-col items-center gap-1">
        <ChevronUp 
          size={40} 
          className="p-1 hover:bg-primary/40 rounded-full duration-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            voteOnPost(props.data.id, 1)
          }}
        />
        <span className="font-medium text-lg">{postKarma}</span>
        <ChevronDown 
          size={40} 
          className="p-1 hover:bg-secondary/40 rounded-full duration-500 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            voteOnPost(props.data.id, -1)
          }}
        />
      </div>
      {/* Details */}
      <div className="flex flex-col w-0 h-full gap-3 flex-1"> 
        <div>
          <h3 className="font-bold truncate">{props.data.title}</h3>
          <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1">
            <span>Postado por</span>
            <span className="font-semibold truncate max-w-[calc(250px-80px)]">{user.username}</span>
            <span>•</span>
            <span>{timeAgo(props.data.created_at)}</span>
          </p>
        </div>
        <pre className="font-light max-h-24 overflow-clip flex-1 text-wrap leading-none">
          {props.data.content}
        </pre>
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-1.5">
            <MessageSquare />
            <span>{comments.length}</span>
          </div>
          <Share2 
            onClick={handleShare} 
            className="shrink-0 text-gray-500 hover:text-black cursor-pointer duration-200" 
          />
        </div>
      </div>
    </Link>
  )
}