"use client";
import { useMainContent } from "@/providers/MainContentProvider";
import PostCard from "./PostCard";

export default function PostList() {
  const { posts } = useMainContent();
  return (
    <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 gap-4 mb-5">
      {posts.map(post => (
        <PostCard 
          key={post.id}
          data={post}
        />
      ))
      }
    </div>
  )
}