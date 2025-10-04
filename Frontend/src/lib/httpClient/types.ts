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

type ApiMeta = {
  message: string;
  timestamp: string; // ISO
  code: number;      // HTTP code
  module?: string;
};

export type ApiResponseSuccess<T> = ApiMeta & {
  ok: true;
  data: T;
};

// export type ApiResponseSuccess<T> = {
//   message: string;
//   data: T;
//   trace?: string[];
//   timestamp: string; // ISO string
//   code: number;
//   module?: string; // 2xx
// };

export type ApiResponseError = ApiMeta & {
  ok: false;
  trace?: string[]; 
};


// export type ApiResponseError<T> = {
//   message: string;
//   data: T;
//   trace?: string[];
//   timestamp: string; // ISO string
//   code: number;
//   module?: string; // 4xx
// };

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export type NextRevalidate = {
  revalidate?: number | false; 
  tags?: string[];
}
export type RequestOptions<Body = never> = {
  method?: HttpMethod;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  body?: Body;
  timeoutMs?: number;
  retries?: number; // number of extra attempts (0 = only 1 try)
  from?: "server" | "client";
  src?: { route?: string; fn?: string };

  cache?: RequestCache;                // "default" | "no-store" | ...
  next?: NextRevalidate
};


export type HttpResult<T> = {
  ok: boolean;
  status: number;
  body?: ApiResponse<T>;
  error?: string;
  trace: TraceInfo;
};