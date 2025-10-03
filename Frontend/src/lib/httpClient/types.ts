export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type TraceInfo = {
  from: "server" | "client";
  startedAt: number; // performance.now()
  endedAt?: number;
  durationMs?: number;
  attempt: number; // current attempt (1-based)
  retries: number; // configured max retries
  to: { method: HttpMethod; baseURL: string; url: string; path: string };
  src?: { route?: string; fn?: string };
};

export type ApiResponseSuccess<T> = {
  message: string;
  data: T;
  timestamp: string; // ISO string
  code: number;
  module?: string; // 2xx
};

export type ApiResponseError = {
  message: string;
  trace?: string[];
  timestamp: string; // ISO string
  code: number;
  module?: string; // 4xx
};

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export type RequestOptions<Body = never> = {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: Body;
  timeoutMs?: number;
  retries?: number; // number of extra attempts (0 = only 1 try)
  from?: "server" | "client";
  src?: { route?: string; fn?: string };
};

export type HttpResult<T> = {
  ok: boolean;
  status: number;
  body?: ApiResponse<T>;
  error?: string;
  trace: TraceInfo;
};