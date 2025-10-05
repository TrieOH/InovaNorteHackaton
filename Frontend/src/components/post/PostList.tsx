"use client";
import { useMainContent } from "@/providers/MainContentProvider";
import PostCard from "./PostCard";

export default function PostList() {
  const { posts } = useMainContent();
  return (
    <div className="max-w-6xl flex flex-col w-full justify-center items-center px-4 gap-4 mb-5">
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