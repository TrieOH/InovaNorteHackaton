// "use server";

// import { api } from "@/lib/httpClient/api";
// import type { PostCreateI, PostGetI } from "@/types/post-interfaces";

// export async function handleCreateUser(data: PostCreateI) {
//   const res = await api.post<null, PostCreateI>("/users", 
//     data, 
//     {src: {fn: "Create User", route: "authActions"} }
//   );
// }

// export async function handleGetAllUsers() {
//   const res = await api.get<PostGetI>("/users", 
//     {src: {fn: "Get Users", route: "authActions"} }
//   );
// }