"use client";

import { timeAgo } from "@/lib/date-utils";
import { useMainContent } from "@/providers/MainContentProvider";
import type { CommentGetI } from "@/types/post-interfaces";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";

type Props = {
  author: string;
  comment: CommentGetI
}

export default function PostComment(props: Props) {
  const { 
    getCommentKarma,
    selectCommentKarma,
    voteOnComment,
  } = useMainContent();

  useEffect(() => {
    getCommentKarma(props.comment.id);
  }, [props.comment.id, getCommentKarma]);

  const commentKarma = selectCommentKarma(props.comment.id);

  return (
    <div className="flex items-center gap-6 border-l-4 border-primary px-3 rounded-sm py-2">
      <div className="flex flex-col items-center gap-1">
        <ChevronUp
          size={40} 
          className="p-1 cursor-pointer hover:bg-primary/40 rounded-full duration-500 transition-colors"
          onClick={() => voteOnComment(props.comment.id, 1)}
        />
        <span className="font-medium text-lg">{commentKarma}</span>
        <ChevronDown
          size={40} 
          className="p-1 cursor-pointer hover:bg-secondary/40 rounded-full duration-500 transition-colors"
          onClick={() => voteOnComment(props.comment.id, -1)}
        />
      </div>
      <div>
        <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1 mb-4">
          <span>Postado por</span>
          <span className="font-semibold truncate max-w-[calc(250px-80px)]">{props.author}</span>
          <span>•</span>
          <span>{timeAgo(props.comment.created_at)}</span>
        </p>
        <pre className="font-thin min-h-24 text-sm overflow-clip flex-1 w-full text-wrap leading-none">
          {props.comment.content}
        </pre>
      </div>
    </div>
  )
}