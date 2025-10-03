// "use server";

// import { api } from "@/lib/httpClient/api";
// import type { PostCreateI, PostGetI } from "@/types/post-interfaces";

// export async function handleCreatePost(data: PostCreateI) {
//   const res = await api.post<null, PostCreateI>("/posts", 
//     data, 
//     {src: {fn: "Create Post", route: "postActions"} }
//   );
// }

// export async function handleGetAllPosts() {
//   const res = await api.get<PostGetI[]>("/posts", 
//     {src: {fn: "Get Posts", route: "postActions"} }
//   );
// }