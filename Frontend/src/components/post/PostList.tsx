"use client";
import PostCard from "./PostCard";
import { usePostsBrowseContext } from "@/providers/PostsBrowserProvider";

export default function PostList() {
  const { items } = usePostsBrowseContext();
  return (
    <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4 mb-5">
      {items.map(post => (
        <PostCard 
          key={post.id}
          data={post}
        />
      ))
      }
    </div>
  )
}