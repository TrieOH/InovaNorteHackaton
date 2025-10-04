"use server";

import { translateMessage } from "@/lib/client/i18n/enToPt";
import { getAuthTokens } from "@/lib/cookies";
import { api } from "@/lib/httpClient/api";
import type { PostCreationDataI } from "@/schemas/post-schema";
import type { PostGetI } from "@/types/post-interfaces";

export async function handleCreatePost(data: PostCreationDataI) {
  const id = (await getAuthTokens()).accessToken ?? "";
  const res = await api.post<null, PostCreationDataI & { user_id: string }>("/posts", 
    {...data, user_id: id}, 
    {src: {fn: "Create Post", route: "postActions"} }
  );
  console.log(res);
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: (res.body?.trace || []).map(translateMessage).join("\n")
  }
}

export async function handleGetAllPosts() {
  const res = await api.get<PostGetI[]>("/posts", 
    {src: {fn: "Get Posts", route: "postActions"} }
  );
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    data: res.body?.data ?? []
  }
}