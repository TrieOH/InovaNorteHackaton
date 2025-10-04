"use client";

import { timeAgo } from "@/lib/date-utils";
import { useMainContent } from "@/providers/MainContentProvider";
import { MessageSquare, SendHorizonal, Share2 } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import { useModal } from "@/providers/ModalProvider";
import { useAuth } from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
}

export default function PostDetails(props: Props) {
  const { openForm, postId } = useModal();
  const { is_logged_in } = useAuth();
  const { getPostById, getAllCommentsFromPost, getCommentsForPost, getPostWithUser, getUserById } = useMainContent();

  useEffect(() => { getPostById(props.id); }, [props.id, getPostById]);
  useEffect(() => { getAllCommentsFromPost(props.id); }, [props.id, getAllCommentsFromPost]);
  const postWUser = getPostWithUser(props.id);
  const comments = getCommentsForPost(props.id);

  return (
    <div className="max-w-6xl mt-16 flex flex-col w-full justify-center items-center px-4 gap-4 mb-5">
      <div className="flex items-center w-full justify-between">
        <div>
          <h3 className="font-bold">{postWUser?.post.title}</h3>
          <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1">
            <span>Postado por</span>
            <span className="font-semibold truncate max-w-[calc(250px-80px)]">{postWUser?.user.username}</span>
            <span>•</span>
            <span>{timeAgo(postWUser?.post.created_at ?? "")}</span>
          </p>
        </div>
        <Share2 />
      </div>
      <pre className="font-normal min-h-24 text-sm overflow-clip flex-1 w-full">{postWUser?.post.content}</pre>
      <div className="flex w-full justify-between">
        <p>dwdw</p>
        <div className="flex gap-1.5">
          <MessageSquare />
          <span>{comments.length}</span>
        </div>
      </div>
      <Button 
        onClick={() => {
          postId.setValue(props.id);
          openForm("comment");
        }}
        variant="outline" 
        disabled={!is_logged_in}
        className={cn(
          "flex justify-between w-full font-normal text-black/60 active:scale-[99%]",
          "p-0 overflow-clip pl-4 border-tertiary hover:bg-tertiary"
        )}
      >
        Compartilhe o seu conhecimento...
        <div className="bg-tertiary h-full w-9 flex justify-center items-center ml-1">
          <SendHorizonal className="text-background" />
        </div>
      </Button>
      <div className="flex flex-col w-full gap-6">
        {comments.map((c, i) => {
          const author = getUserById(c.user_id);
          return (
            <div key={c.id || i}>
              <div className="border-l-4 border-primary px-3 rounded-sm">
                <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1 mb-2">
                  <span>Postado por</span>
                  <span className="font-semibold truncate max-w-[calc(250px-80px)]">{author?.username}</span>
                  <span>•</span>
                  <span>{timeAgo(c.created_at)}</span>
                </p>
                <pre className="font-thin min-h-24 text-sm overflow-clip flex-1 w-full">{c.content}</pre>
              </div>

              {i < comments.length - 1 && (
                <div className="flex items-center w-full gap-4 px-4">
                  <hr className="border-black/20 flex-1" />
                  <span className="font-thin text-black/20">OR</span>
                  <hr className="border-black/20 flex-1" />
                </div>
              )}
            </div>
          )}
        )}
      </div>
    </div>
  )
}