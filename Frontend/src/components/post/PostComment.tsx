"use client";

import { timeAgo } from "@/lib/date-utils";
import { useMainContent } from "@/providers/MainContentProvider";
import type { CommentGetI } from "@/types/post-interfaces";
import { BadgeCheck, BadgeQuestionMark, ChevronDown, ChevronUp } from "lucide-react";
import { useEffect } from "react";

type Props = {
  author: string;
  comment: CommentGetI;
  has_permission: boolean;
}

export default function PostComment(props: Props) {
  const { 
    getCommentKarma,
    selectCommentKarma,
    voteOnComment,
    toggleCommentAnswer
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
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1">
            <span>Postado por</span>
            <span className="font-semibold truncate max-w-[calc(250px-80px)]">{props.author}</span>
            <span>•</span>
            <span>{timeAgo(props.comment.created_at)}</span>
          </p>
          {props.has_permission && (!props.comment.is_answer ?
            <BadgeQuestionMark 
              onClick={() => toggleCommentAnswer(props.comment.id)}
              size={32}
              className="shrink-0 text-primary/80 hover:text-black cursor-pointer duration-200" 
            />
            :
            <BadgeCheck 
              onClick={() => toggleCommentAnswer(props.comment.id)}
              size={32}
              className="shrink-0 text-secondary/80 hover:text-black cursor-pointer duration-200" 
            />
          )}
        </div>
        <pre className="font-thin min-h-24 text-sm overflow-clip flex-1 w-full text-wrap leading-none">
          {props.comment.content}
        </pre>
      </div>
    </div>
  )
}