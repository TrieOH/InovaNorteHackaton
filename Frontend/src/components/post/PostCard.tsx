import type { PostFormattedCardI } from "@/types/post-interfaces";

interface PostI {
  data: PostFormattedCardI
}

export default function PostCard(props: PostI) {
  return (
    <div>
      {/* Details */}
      <div className="flex flex-col w-full"> 
        <h3>{props.data.title}</h3>
      </div>
    </div>
  )
}