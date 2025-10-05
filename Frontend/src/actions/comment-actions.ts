"use server";
import { translateMessage } from "@/lib/client/i18n/enToPt";
import { getAuthTokens } from "@/lib/cookies";
import { api } from "@/lib/httpClient/api";
import type { CommentCreationDataI } from "@/schemas/post-schema";
import { CommentGetI } from "@/types/post-interfaces";

// If comment_id is null the comment is from the post
export async function handleCreateCommentOnPost(content: string, post_id: number, comment_id: number | null) {
  const id = (await getAuthTokens()).accessToken ?? "";
  const res = await api.post<CommentGetI, CommentCreationDataI & { user_id: string, is_child_of: number | null }>
  (`/posts/${post_id}/comments`, 
    {
      content: content,
      user_id: id,
      is_child_of: comment_id,
    }, 
    { src: {fn: "Create Post Comment", route: "commentActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : null
  }
}

// From post and comments, including the children comments
export async function handleGetAllComentsFromPost(post_id: number) {
  const res = await api.get<CommentGetI[]>(`/posts/${post_id}/comments`,
    { src: {fn: "Get All Comments From Post", route: "commentActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : null
  }
}

// Get all comments children these children are comment too, not include the child childrens
export async function handleGetAllComentsChildren(comment_id: number) {
  const res = await api.get<CommentGetI[]>(`/comments/${comment_id}/children`,
    { src: {fn: "Get All Comments", route: "commentActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : null
  }
}