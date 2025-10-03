// "use server";

// import { api } from "@/lib/httpClient/api";
// import type { UserCreationDataI } from "@/schemas/user-schema";
// import type { UserGetI } from "@/types/user-interfaces";

// export async function handleCreateUser(data: UserCreationDataI) {
//   const res = await api.post<null, UserCreationDataI>("/users", 
//     data, 
//     {src: {fn: "Create User", route: "authActions"} }
//   );
// }

// export async function handleGetAllUsers() {
//   const res = await api.get<UserGetI[]>("/users", 
//     {src: {fn: "Get Users", route: "authActions"} }
//   );
// }