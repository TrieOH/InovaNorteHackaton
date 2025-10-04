"use server";

import { translateMessage } from "@/lib/client/i18n/enToPt";
import { api } from "@/lib/httpClient/api";
import type { UserCreationDataI } from "@/schemas/user-schema";

export async function handleCreateUser(data: UserCreationDataI) {
  const res = await api.post<null, UserCreationDataI>("/users", 
    data, 
    {src: {fn: "Create User", route: "authActions"} }
  );
  console.log(res)
  return { 
    success: res.ok,
    message: translateMessage(res.body?.message), 
    error: translateMessage(res.error), 
    trace: (res.body?.trace || []).map(translateMessage).join("\n")
  }
}

// export async function handleGetAllUsers() {
//   const res = await api.get<UserGetI[]>("/users", 
//     {src: {fn: "Get Users", route: "authActions"} }
//   );
// }