import { timeAgo } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { useMainContent } from "@/providers/MainContentProvider";
import type { PostGetI } from "@/types/post-interfaces";
import { MessageSquare, Share2 } from "lucide-react";

interface PostI {
  data: PostGetI
}

export default function PostCard(props: PostI) {
  const { getUserById } = useMainContent();
  const user = getUserById(props.data.user_id);
  if(!user) return;
  return (
    <div className={cn(
      "w-full h-56 rounded-md px-5 py-2.5 cursor-pointer duration-500",
      "border-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] border-primary/50 hover:border-primary hover:scale-[102%]"
    )}>
      {/* Details */}
      <div className={cn(
        "flex flex-col w-full h-full gap-3 flex-1"
      )}> 
        <div>
          <h3 className="font-bold">{props.data.title}</h3>
          <p className="max-w-[360px] text-sm flex flex-wrap items-center gap-1">
            <span>Postado por</span>
            <span className="font-semibold truncate max-w-[calc(250px-80px)]">{user.username}</span>
            <span>•</span>
            <span>{timeAgo(props.data.created_at)}</span>
          </p>
        </div>
        <pre className="font-light max-h-24 overflow-clip flex-1">{props.data.content}</pre>
        <div className="flex w-full items-center justify-between">
          <div className="flex gap-1.5">
            <MessageSquare />
            <span>{0}</span>
          </div>
          <Share2 />
        </div>
      </div>
    </div>
  )
}