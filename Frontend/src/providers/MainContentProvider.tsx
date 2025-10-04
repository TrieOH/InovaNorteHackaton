"use client";
import { handleGetAllUsers, handleGetUserByID } from "@/actions/auth-actions";
import { handleCreatePost, handleGetAllPosts, handleGetPostByID } from "@/actions/post-actions";
import type { PostCreationDataI } from "@/schemas/post-schema";
import type { PostGetI } from "@/types/post-interfaces";
import type { UserGetI } from "@/types/user-interfaces";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";

type State = {
  postsById: Record<number, PostGetI>;
  postList: number[];
  usersById: Record<string, UserGetI>;
  loaded: { users: boolean; posts: boolean };
  loading: { users: boolean; posts: boolean };
};

const initialState: State = {
  postsById: {},
  postList: [],
  usersById: {},
  loaded: { users: false, posts: false },
  loading: { users: false, posts: false },
};

type Action =
  | { type: 'UPSERT_POSTS'; posts: PostGetI[] }
  | { type: 'UPSERT_USERS'; users: UserGetI[] }
  | { type: 'UPSERT_USER'; user: UserGetI }
  | { type: 'UPSERT_POST'; post: PostGetI }
  | { type: "SET_LOADING"; key: keyof State["loading"]; value: boolean }
  | { type: "SET_LOADED"; key: keyof State["loaded"]; value: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "UPSERT_POSTS": {
      const postsById = { ...state.postsById };
      const postList = [...state.postList];
      for (const p of action.posts) {
        postsById[p.id] = p;
        if (!postList.includes(p.id)) postList.unshift(p.id);
      }
      return { ...state, postsById, postList };
    }
    case "UPSERT_POST": {
      const postsById = { ...state.postsById, [action.post.id]: action.post };
      const postList = state.postList.includes(action.post.id)
        ? state.postList
        : [action.post.id, ...state.postList];
      return { ...state, postsById, postList };
    }
    case "UPSERT_USERS": {
      const usersById = { ...state.usersById };
      for (const u of action.users) usersById[u.id] = u;
      return { ...state, usersById };
    }
    case "UPSERT_USER": {
      const usersById = { ...state.usersById, [action.user.id]: action.user };
      return { ...state, usersById };
    }
    case "SET_LOADING":
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };
    case "SET_LOADED":
      return { ...state, loaded: { ...state.loaded, [action.key]: action.value } };
    default:
      return state;
  }
}

type MainContentContextType = {
  getAllPosts: () => Promise<PostGetI[]>;
  getPostById: (id: number) => Promise<PostGetI | null>;
  createPost: (post: PostCreationDataI) => Promise<{
    success: boolean,
    message: string | undefined,
    error: string | undefined,
    trace: string | null,
  }>;
  posts: PostGetI[];
  getPostWithUser: (id: number) => { post: PostGetI; user: UserGetI } | undefined;
  getUserById: (id: string) => UserGetI | undefined;

  // Flags
  loaded: State["loaded"];
  loading: State["loading"];
};

const PostsContext = createContext<MainContentContextType | undefined>(undefined);

export function MainContentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const inflightPostById = useRef<Map<number, Promise<PostGetI | null>>>(new Map());
  const inflightUserById = useRef<Map<string, Promise<UserGetI | null>>>(new Map());
  const inflightAllPosts = useRef<Promise<PostGetI[]> | null>(null);
  const inflightAllUsers = useRef<Promise<UserGetI[]> | null>(null);

  // ---------- Users ----------
  const fetchUserById = useCallback(
    async (id: string): Promise<UserGetI | null> => {
      const cached = state.usersById[id];
      if (cached) return cached;

      const running = inflightUserById.current.get(id);
      if (running) return running;

      const p = (async () => {
        const res = await handleGetUserByID(id);
        if(res.data) dispatch({ type: "UPSERT_USER", user: res.data });
        return res.data;
      })();

      inflightUserById.current.set(id, p);
      try {
        return await p;
      } finally {
        inflightUserById.current.delete(id);
      }
    },
    [state.usersById]
  );

  const fetchAllUsers = useCallback(async (): Promise<UserGetI[]> => {
    if (state.loaded.users) return Object.values(state.usersById);
    if (inflightAllUsers.current) return inflightAllUsers.current;

    dispatch({ type: "SET_LOADING", key: "users", value: true });

    const p = (async () => {
      const res = await handleGetAllUsers();
      const users = res.data;
      if (users.length) dispatch({ type: "UPSERT_USERS", users });
      dispatch({ type: "SET_LOADED", key: "users", value: true });
      dispatch({ type: "SET_LOADING", key: "users", value: false });
      return users;
    })();

    inflightAllUsers.current = p;
    try {
      return await p;
    } finally {
      inflightAllUsers.current = null;
    }
  }, [state.loaded.users, state.usersById]);

  const ensureUsersForPosts = useCallback(
    async (posts: PostGetI[]) => {
      const missing = Array.from(new Set(posts.map((p) => p.user_id))).filter(
        (uid) => !state.usersById[uid]
      );
      if (missing.length === 0) return;
      await Promise.all(missing.map((id) => fetchUserById(id)));
    },
    [state.usersById, fetchUserById]
  );


  // ---------- Posts ----------
  const getAllPosts = useCallback(async (): Promise<PostGetI[]> => {
    if (state.loaded.posts) return Object.values(state.postsById);
    if (inflightAllPosts.current) return inflightAllPosts.current;

    dispatch({ type: "SET_LOADING", key: "posts", value: true });

    const p = (async () => {
      await fetchAllUsers();

      const res = await handleGetAllPosts();
      const posts = res.data ?? [];
      if (posts.length) {
        dispatch({ type: "UPSERT_POSTS", posts });
        await ensureUsersForPosts(posts);
      }
      dispatch({ type: "SET_LOADED", key: "posts", value: true });
      dispatch({ type: "SET_LOADING", key: "posts", value: false });
      return posts;
    })();

    inflightAllPosts.current = p;
    try {
      return await p;
    } finally {
      inflightAllPosts.current = null;
    }
  }, [state.loaded.posts, state.postsById, fetchAllUsers, ensureUsersForPosts]);

  const getPostById = useCallback(
    async (id: number): Promise<PostGetI | null> => {
      const cached = state.postsById[id];
      if (cached) return cached;

      const running = inflightPostById.current.get(id);
      if (running) {
        const r = await running;
        if (!r) return null;
        return r;
      }

      const p = (async () => {
        await fetchAllUsers();
        const res = await handleGetPostByID(id);
        if (!res.success || !res.data) return null;
        dispatch({ type: "UPSERT_POST", post: res.data });
        await fetchUserById(res.data.user_id);
        return res.data;
      })();

      inflightPostById.current.set(id, p);
      try {
        const got = await p;
        if (!got) return null;
        return got;
      } finally {
        inflightPostById.current.delete(id);
      }
    },
    [state.postsById, fetchAllUsers, fetchUserById]
  );

  const createPost = useCallback(
    async (payload: PostCreationDataI) => {
      const res = await handleCreatePost(payload);
      if (res.data) {
        const post = res.data as PostGetI;
        dispatch({ type: "UPSERT_POST", post });
        await fetchUserById(post.user_id);
      }
      return {
        success: res.success,
        message: res.message,
        error: res.error,
        trace: res.trace,
      };
    },
    [fetchUserById]
  );

  useEffect(() => {
    (async () => {
      await fetchAllUsers();
      await getAllPosts();
    })();
  }, [fetchAllUsers, getAllPosts]);


  // ---------- Selectors ----------
  const posts = Object.values(state.postsById).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const getUserById = useCallback((id: string) => state.usersById[id], [state.usersById]);
  const getPostWithUser = useCallback(
    (id: number) => {
      const post = state.postsById[id];
      if (!post) return undefined;
      const user = state.usersById[post.user_id];
      if (!user) return undefined;
      return { post, user };
    },
    [state.postsById, state.usersById]
  );
  
  const value: MainContentContextType = {
    getAllPosts,
    getPostById,
    createPost,
    posts,
    getPostWithUser,
    getUserById,
    loaded: state.loaded,
    loading: state.loading,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export const useMainContent = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePostsContext must be used within PostsProvider');
  return ctx;
};