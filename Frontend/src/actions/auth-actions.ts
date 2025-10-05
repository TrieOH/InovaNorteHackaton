"use server";

import { translateMessage } from "@/lib/client/i18n/enToPt";
import { setAuthTokens } from "@/lib/cookies";
import { api } from "@/lib/httpClient/api";
import type { UserCreationDataI, UserLoginDataI } from "@/schemas/user-schema";
import type { UserGetI } from "@/types/user-interfaces";
import { revalidateTag } from "next/cache";

export async function handleCreateUser(data: UserCreationDataI) {
  const res = await api.post<null, UserCreationDataI>("/users", 
    data, 
    {
      src: {fn: "Create User", route: "authActions"},
      cache: "no-store",
    }
  );
  if(res.ok) revalidateTag("users");
  // console.log(res)
  return { 
    success: res.ok,
    message: translateMessage(res.body?.message),
    error: translateMessage(res.error),
    trace: !res.body?.ok ? (res.body?.trace || []).map(translateMessage).join("\n") : null
  }
}

export async function handleLoginUser(data: UserLoginDataI) {
  const res = await api.post<string, UserLoginDataI>("/auth/login", 
    data, 
    {
      src: {fn: "Perform Login", route: "authActions"},
      cache: "no-store",
    }
  );
  // console.log(res)
  if(res.body?.ok && res.body?.data) await setAuthTokens(res.body?.data);
  return { 
    success: res.ok,
    message: translateMessage(res.body?.message), 
    error: translateMessage(res.error), 
    trace: !res.body?.ok ? (res.body?.trace || []).map(msg => translateMessage(`login:${msg}`)).join("\n") : null
  }
}

export async function handleGetAllUsers() {
  const res = await api.get<UserGetI[]>("/users", 
    {
      src: {fn: "Get Users", route: "authActions"},
      next: { tags: ["users"], revalidate: 120 },
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

export async function handleGetUserByID(id: string) {
  const res = await api.get<UserGetI>(`/users/${id}`, 
    {
      src: {fn: "Get User By ID", route: "authActions"},
      next: { tags: ["users", `user:${id}`], revalidate: 300 },
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