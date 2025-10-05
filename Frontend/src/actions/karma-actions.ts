import { translateMessage } from "@/lib/client/i18n/enToPt";
import { getAuthTokens } from "@/lib/cookies";
import { api } from "@/lib/httpClient/api";

// 1 positive -1 negative
export async function handleVoteOnPost(post_id: number, vote: number = 1) {
  const id = (await getAuthTokens()).accessToken ?? "";
  const res = await api.post<null, { user_id: string, vote: number }>(`/posts/${post_id}/vote`, 
    {
      user_id: id,
      vote: vote
    }, 
    { src: {fn: "Vote On Post", route: "voteActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
  }
}

export async function handleGetAllPostVote(post_id: number) {
  const res = await api.get<number>(`/posts/${post_id}/karma`,
    { src: {fn: "Get All Post Votes", route: "commentActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : 0
  }
}

// 1 positive -1 negative
export async function handleVoteOnComment(comment_id: number, vote: number = 1) {
  const id = (await getAuthTokens()).accessToken ?? "";
  const res = await api.post<null, { user_id: string, vote: number }>(`/comments/${comment_id}/vote`, 
    {
      user_id: id,
      vote: vote
    }, 
    { src: {fn: "Vote On Comment", route: "voteActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
  }
}

export async function handleGetAllCommentVote(comment_id: number) {
  const res = await api.get<number>(`/comments/${comment_id}/karma`,
    { src: {fn: "Get All Comments Votes", route: "commentActions"} }
  );
  // console.log(res)
  return {
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null,
    data: res.body?.ok ? res.body?.data : 0
  }
}