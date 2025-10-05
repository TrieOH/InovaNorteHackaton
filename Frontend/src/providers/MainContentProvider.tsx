"use client";
import { handleGetAllUsers, handleGetUserByID } from "@/actions/auth-actions";
import { handleCreateCommentOnPost, handleGetAllComentsFromPost, handleUpdatePostComment } from "@/actions/comment-actions";
import { handleGetAllCommentVote, handleGetAllPostVote, handleVoteOnComment, handleVoteOnPost } from "@/actions/karma-actions";
import { handleCreatePost, handleGetAllPosts, handleGetPostByID } from "@/actions/post-actions";
import { isTheSameUser } from "@/lib/cookies";
import type { PostCreationDataI } from "@/schemas/post-schema";
import type { CommentGetI, PostGetI } from "@/types/post-interfaces";
import type { UserGetI } from "@/types/user-interfaces";
import { createContext, type ReactNode, useCallback, useContext, useEffect, useReducer, useRef } from "react";

type State = {
  postsById: Record<number, PostGetI>;
  postList: number[];
  usersById: Record<string, UserGetI>;
  loaded: { users: boolean; posts: boolean };
  loading: { users: boolean; posts: boolean };

  // Comments
  commentsById: Record<number, CommentGetI>;
  commentsByPostId: Record<number, number[]>;
  commentsChildrenById: Record<number, number[]>;
  loadedCommentsForPost: Record<number, boolean>;
  loadingCommentsForPost: Record<number, boolean>;
  loadedChildrenForComment: Record<number, boolean>;
  loadingChildrenForComment: Record<number, boolean>;

  // Karma
  postKarmaById: Record<number, number>;
  commentKarmaById: Record<number, number>;
};

const initialState: State = {
  postsById: {},
  postList: [],
  usersById: {},
  loaded: { users: false, posts: false },
  loading: { users: false, posts: false },

  commentsById: {},
  commentsByPostId: {},
  commentsChildrenById: {},
  loadedCommentsForPost: {},
  loadingCommentsForPost: {},
  loadedChildrenForComment: {},
  loadingChildrenForComment: {},

  postKarmaById: {},
  commentKarmaById: {},
};

type Action =
  | { type: 'UPSERT_POSTS'; posts: PostGetI[] }
  | { type: 'UPSERT_USERS'; users: UserGetI[] }
  | { type: 'UPSERT_USER'; user: UserGetI }
  | { type: 'UPSERT_POST'; post: PostGetI }
  | { type: "SET_LOADING"; key: keyof State["loading"]; value: boolean }
  | { type: "SET_LOADED"; key: keyof State["loaded"]; value: boolean }

  // Comments
  | { type: "UPSERT_COMMENTS_FOR_POST"; postId: number; comments: CommentGetI[] }
  | { type: "UPSERT_CHILDREN_FOR_COMMENT"; commentId: number; children: CommentGetI[] }
  | { type: "UPSERT_COMMENT"; comment: CommentGetI }
  | { type: "SET_LOADING_COMMENTS_FOR_POST"; postId: number; value: boolean }
  | { type: "SET_LOADED_COMMENTS_FOR_POST"; postId: number; value: boolean }
  | { type: "SET_LOADING_CHILDREN_FOR_COMMENT"; commentId: number; value: boolean }
  | { type: "SET_LOADED_CHILDREN_FOR_COMMENT"; commentId: number; value: boolean }

  // Karma
  | { type: "SET_POST_KARMA"; postId: number; karma: number }
  | { type: "SET_COMMENT_KARMA"; commentId: number; karma: number };


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
    
    // Comments
    case "UPSERT_COMMENTS_FOR_POST": {
      const commentsById = { ...state.commentsById };
      const rootIds = new Set<number>(state.commentsByPostId[action.postId] ?? []);
      const childrenMap = { ...state.commentsChildrenById };

      for (const c of action.comments) {
        commentsById[c.id] = c;
        if (c.is_child_of == null) {
          rootIds.add(c.id);
        } else {
          const arr = new Set<number>(childrenMap[c.is_child_of] ?? []);
          arr.add(c.id);
          childrenMap[c.is_child_of] = Array.from(arr);
        }
      }
      return {
        ...state,
        commentsById,
        commentsChildrenById: childrenMap,
        commentsByPostId: { ...state.commentsByPostId, [action.postId]: Array.from(rootIds) },
      };
    }
    case "UPSERT_CHILDREN_FOR_COMMENT": {
      const commentsById = { ...state.commentsById };
      const childIds = new Set<number>(state.commentsChildrenById[action.commentId] ?? []);
      for (const c of action.children) {
        commentsById[c.id] = c;
        childIds.add(c.id);
      }
      return {
        ...state,
        commentsById,
        commentsChildrenById: { ...state.commentsChildrenById, [action.commentId]: Array.from(childIds) },
      };
    }
    case "UPSERT_COMMENT": {
      const c = action.comment;
      const commentsById = { ...state.commentsById, [c.id]: c };
      const commentsByPostId = { ...state.commentsByPostId };
      const commentsChildrenById = { ...state.commentsChildrenById };
      if (c.is_child_of == null) {
        const roots = new Set<number>(commentsByPostId[c.post_id] ?? []);
        roots.add(c.id);
        commentsByPostId[c.post_id] = Array.from(roots);
      } else {
        const children = new Set<number>(commentsChildrenById[c.is_child_of] ?? []);
        children.add(c.id);
        commentsChildrenById[c.is_child_of] = Array.from(children);
      }
      return { ...state, commentsById, commentsByPostId, commentsChildrenById };
    }
    case "SET_LOADING_COMMENTS_FOR_POST":
      return { ...state, loadingCommentsForPost: { ...state.loadingCommentsForPost, [action.postId]: action.value } };
    case "SET_LOADED_COMMENTS_FOR_POST":
      return { ...state, loadedCommentsForPost: { ...state.loadedCommentsForPost, [action.postId]: action.value } };
    case "SET_LOADING_CHILDREN_FOR_COMMENT":
      return { ...state, loadingChildrenForComment: { ...state.loadingChildrenForComment, [action.commentId]: action.value } };
    case "SET_LOADED_CHILDREN_FOR_COMMENT":
      return { ...state, loadedChildrenForComment: { ...state.loadedChildrenForComment, [action.commentId]: action.value } };

    case "SET_POST_KARMA":
      return {
        ...state,
        postKarmaById: { ...state.postKarmaById, [action.postId]: action.karma },
      };
    case "SET_COMMENT_KARMA":
      return {
        ...state,
        commentKarmaById: { ...state.commentKarmaById, [action.commentId]: action.karma },
      };

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

  // Comments
  getAllCommentsFromPost: (postId: number, opts?: { force?: boolean }) => Promise<CommentGetI[]>;
  createCommentOnPost: (args: { content: string; post_id: number; comment_id: number | null }) => Promise<{
    success: boolean;
    message: string | undefined;
    error: string | undefined;
    trace: string | null;
  }>;
  toggleCommentAnswer: (
    commentId: number,
    opts?: { exclusive?: boolean }
  ) => Promise<{
    success: boolean;
    message?: string;
    error?: string;
    trace: string | null;
  }>;
  getCommentsForPost: (postId: number) => CommentGetI[];
  getChildrenForComment: (commentId: number) => CommentGetI[];

  // Karma
  getPostKarma: (postId: number) => Promise<number>;
  getCommentKarma: (commentId: number) => Promise<number>;
  voteOnPost: (postId: number, vote?: 1 | -1) => Promise<{ success: boolean; message?: string; error?: string; trace: string | null }>;
  voteOnComment: (commentId: number, vote?: 1 | -1) => Promise<{ success: boolean; message?: string; error?: string; trace: string | null }>;
  selectPostKarma: (postId: number) => number;
  selectCommentKarma: (commentId: number) => number;
  
  // Flags
  loaded: State["loaded"];
  loading: State["loading"];
  loadingCommentsForPost: State["loadingCommentsForPost"];
  loadedCommentsForPost: State["loadedCommentsForPost"];
  loadingChildrenForComment: State["loadingChildrenForComment"];
  loadedChildrenForComment: State["loadedChildrenForComment"];
};

const PostsContext = createContext<MainContentContextType | undefined>(undefined);

export function MainContentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const inflightPostById = useRef<Map<number, Promise<PostGetI | null>>>(new Map());
  const inflightUserById = useRef<Map<string, Promise<UserGetI | null>>>(new Map());
  const inflightAllPosts = useRef<Promise<PostGetI[]> | null>(null);
  const inflightAllUsers = useRef<Promise<UserGetI[]> | null>(null);

  const inflightCommentsByPostId = useRef<Map<number, Promise<CommentGetI[]>>>(new Map());

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
    }, [state.usersById, fetchUserById]);

  const ensureUsersForComments = useCallback(async (comments: CommentGetI[]) => {
    const missing = Array.from(new Set(comments.map((c) => c.user_id))).filter((uid) => !state.usersById[uid]);
    if (missing.length === 0) return;
    await Promise.all(missing.map((id) => fetchUserById(id)));
  }, [state.usersById, fetchUserById]);


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

  // ---------- Comments ----------
  const getAllCommentsFromPost = useCallback(async (postId: number, opts?: { force?: boolean }): Promise<CommentGetI[]> => {
    if (!!!opts?.force && state.loadedCommentsForPost[postId]) {
      const rootIds = state.commentsByPostId[postId] ?? [];
      return rootIds.map((id) => state.commentsById[id]).filter(Boolean);
    }

    const running = inflightCommentsByPostId.current.get(postId);
    if (running) return running;

    dispatch({ type: "SET_LOADING_COMMENTS_FOR_POST", postId, value: true });

    const p = (async () => {
      const res = await handleGetAllComentsFromPost(postId);
      const comments = res.data ?? [];
      if (comments.length) {
        dispatch({ type: "UPSERT_COMMENTS_FOR_POST", postId, comments });
        await ensureUsersForComments(comments);
      }
      dispatch({ type: "SET_LOADED_COMMENTS_FOR_POST", postId, value: true });
      dispatch({ type: "SET_LOADING_COMMENTS_FOR_POST", postId, value: false });
      return comments.filter((c) => c.is_child_of == null);
    })();

    inflightCommentsByPostId.current.set(postId, p);
    try {
      return await p;
    } finally {
      inflightCommentsByPostId.current.delete(postId);
    }
  }, [
    state.loadedCommentsForPost,
    state.commentsByPostId,
    state.commentsById,
    ensureUsersForComments,
  ]);

  const createCommentOnPost = useCallback(async (args: { content: string; post_id: number; comment_id: number | null }) => {
    const res = await handleCreateCommentOnPost(args.content, args.post_id, args.comment_id);
    if (res.data) {
      const c = res.data as CommentGetI;
      dispatch({ type: "UPSERT_COMMENT", comment: c });
      await fetchUserById(c.user_id);
    }
    return { success: res.success, message: res.message, error: res.error, trace: res.trace };
  }, [fetchUserById]);

  const setCommentAnswer = useCallback(
    async (commentId: number, isAnswer: boolean, opts?: { exclusive?: boolean }) => {
      const c = state.commentsById[commentId];
      if (!c) return { success: false, message: undefined, error: "Comentário não carregado", trace: null };

      const post = state.postsById[c.post_id];
      if (!post) {
        return { success: false, message: undefined, error: "Post não carregado", trace: null };
      }

      const sameUser = await isTheSameUser(post.user_id);
      if (!sameUser) {
        return {
          success: false,
          message: undefined,
          error: "Somente o autor do post pode marcar uma resposta.",
          trace: null,
        };
      }

      const prevIsAnswer = c.is_answer;
      const postId = c.post_id;

      dispatch({ type: "UPSERT_COMMENT", comment: { ...c, is_answer: isAnswer } });

      // If exclusive, remove 'is_answer' of all others comments
      let changedOthers: CommentGetI[] = [];
      if (opts?.exclusive && isAnswer) {
        changedOthers = Object.values(state.commentsById)
          .filter((x) => x.post_id === postId && x.id !== c.id && x.is_answer)
          .map((x) => ({ ...x, is_answer: false }));

        for (const other of changedOthers) dispatch({ type: "UPSERT_COMMENT", comment: other });
      }

      const res = await handleUpdatePostComment({ ...c, is_answer: isAnswer });

      if (!res.success) {
        // rollback
        dispatch({ type: "UPSERT_COMMENT", comment: { ...c, is_answer: prevIsAnswer } });
        if (opts?.exclusive && isAnswer && changedOthers.length) {
          for (const other of changedOthers) {
            dispatch({ type: "UPSERT_COMMENT", comment: { ...other, is_answer: true } });
          }
        }
        await getAllCommentsFromPost(postId, { force: true });
      }
      return res;
    },
    [state.commentsById, state.postsById, getAllCommentsFromPost]
  );

  
  const toggleCommentAnswer = useCallback(
    async (commentId: number, opts?: { exclusive?: boolean }) => {
      const c = state.commentsById[commentId];
      if (!c) return { success: false, message: undefined, error: "Comentário não carregado", trace: null };
      return setCommentAnswer(commentId, !c.is_answer, opts);
    },
    [state.commentsById, setCommentAnswer]
  );

  // Karma
  const getPostKarma = useCallback(async (postId: number): Promise<number> => {
    const res = await handleGetAllPostVote(postId);
    const karma = res.data ?? 0;
    dispatch({ type: "SET_POST_KARMA", postId, karma });
    return karma;
  }, []);

  const getCommentKarma = useCallback(async (commentId: number): Promise<number> => {
    const res = await handleGetAllCommentVote(commentId);
    const karma = res.data ?? 0;
    dispatch({ type: "SET_COMMENT_KARMA", commentId, karma });
    return karma;
  }, []);

  const voteOnPost = useCallback(async (postId: number, vote: 1 | -1 = 1) => {
    const res = await handleVoteOnPost(postId, vote);
    if (res.success) await getPostKarma(postId);
    return res;
  }, [getPostKarma]);

  const voteOnComment = useCallback(async (commentId: number, vote: 1 | -1 = 1) => {
    const res = await handleVoteOnComment(commentId, vote);
    if (res.success) await getCommentKarma(commentId);
    return res;
  }, [getCommentKarma]);

  const selectPostKarma = useCallback((postId: number) => state.postKarmaById[postId] ?? 0, [state.postKarmaById]);
  const selectCommentKarma = useCallback((commentId: number) => state.commentKarmaById[commentId] ?? 0, [state.commentKarmaById]);

  // ---------- Boot ----------
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
  const getPostWithUser = useCallback((id: number) => {
    const post = state.postsById[id];
    if (!post) return undefined;
    const user = state.usersById[post.user_id];
    if (!user) return undefined;
    return { post, user };
  }, [state.postsById, state.usersById]);

  const getCommentsForPost = useCallback((postId: number): CommentGetI[] => {
    const ids = state.commentsByPostId[postId] ?? [];
    const arr = ids.map((id) => state.commentsById[id]).filter(Boolean) as CommentGetI[];
    return arr;
  }, [state.commentsByPostId, state.commentsById]);

  const getChildrenForComment = useCallback((commentId: number): CommentGetI[] => {
    const ids = state.commentsChildrenById[commentId] ?? [];
    const arr = ids.map((id) => state.commentsById[id]).filter(Boolean) as CommentGetI[];
    return arr.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [state.commentsChildrenById, state.commentsById]);
  
  const value: MainContentContextType = {
    getAllPosts,
    getPostById,
    createPost,
    posts,
    getPostWithUser,
    getUserById,

    // comments
    getAllCommentsFromPost,
    createCommentOnPost,
    getCommentsForPost,
    getChildrenForComment,
    toggleCommentAnswer,
    

    // Karma
    getPostKarma,
    getCommentKarma,
    voteOnPost,
    voteOnComment,
    selectPostKarma,
    selectCommentKarma,


    // Flags
    loaded: state.loaded,
    loading: state.loading,
    loadingCommentsForPost: state.loadingCommentsForPost,
    loadedCommentsForPost: state.loadedCommentsForPost,
    loadingChildrenForComment: state.loadingChildrenForComment,
    loadedChildrenForComment: state.loadedChildrenForComment,
  };

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>;
}

export const useMainContent = () => {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error('usePostsContext must be used within PostsProvider');
  return ctx;
};