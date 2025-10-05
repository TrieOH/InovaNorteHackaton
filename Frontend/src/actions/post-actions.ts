"use server";

import { translateMessage } from "@/lib/client/i18n/enToPt";
import { getAuthTokens } from "@/lib/cookies";
import { api } from "@/lib/httpClient/api";
import type { PostCreationDataI } from "@/schemas/post-schema";
import type { PostGetI } from "@/types/post-interfaces";
import { revalidateTag } from "next/cache";

export async function handleCreatePost(data: PostCreationDataI) {
  const id = (await getAuthTokens()).accessToken ?? "";
  const res = await api.post<PostGetI, PostCreationDataI & { user_id: string }>("/posts", 
    {...data, user_id: id}, 
    { src: {fn: "Create Post", route: "postActions"} }
  );
  if(res.ok) revalidateTag("posts");
  // console.log(res);
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : null
  }
}

export async function handleGetAllPosts() {
  const res = await api.get<PostGetI[]>("/posts", 
    {
      src: {fn: "Get Posts", route: "postActions"},
      next: { tags: ["posts"], revalidate: 60 },
    }
  );
  // console.log(res);
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    data: res.body?.ok ? res.body?.data : []
  }
}

export async function handleGetPostByID(id: number) {
  const res = await api.get<PostGetI>(`/posts/${id}`, 
    {
      src: {fn: "Get Post By ID", route: "postActions"},
      next: { tags: ["posts", `post:${id}`], revalidate: 60 },
    }
  );
  // console.log(res);
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    data: res.body?.ok ? res.body?.data : null
  }
}