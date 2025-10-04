import { buildUrl, sleep } from "./helper";
import type {
  ApiResponse,
  ApiResponseError,
  ApiResponseSuccess,
  HttpResult,
  NextRevalidate,
  RequestOptions,
  TraceInfo,
} from "./types";

export class HttpClient {
  constructor(
    public baseURL: string,
    private defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    },
    private timeoutMs = 8000,
    private defaultRetries = 0,
    private from: "server" | "client" = "client"
  ) {
    this.baseURL = baseURL.replace(/\/+$/u, "");
  }

  createInstance(
    opts?: Partial<{
      baseURL: string;
      defaultHeaders: Record<string, string>;
      timeoutMs: number;
      defaultRetries: number;
      from?: "server" | "client";
    }>
  ): HttpClient {
    return new HttpClient(
      opts?.baseURL ?? this.baseURL,
      { ...this.defaultHeaders, ...(opts?.defaultHeaders ?? {}) },
      opts?.timeoutMs ?? this.timeoutMs,
      opts?.defaultRetries ?? this.defaultRetries,
      opts?.from ?? this.from
    );
  }

  setHeader(key: string, value: string) {
    this.defaultHeaders[key] = value;
  }
  removeHeader(key: string) {
    delete this.defaultHeaders[key];
  }
  getHeaders() {
    return { ...this.defaultHeaders };
  }

  async request<TData, TBody = never>(
    path: string,
    opts: RequestOptions<TBody> = {}
  ): Promise<HttpResult<TData>> {
    const method = opts.method ?? "GET";
    const retries = opts.retries ?? this.defaultRetries;
    const timeoutMs = opts.timeoutMs ?? this.timeoutMs;
    const url = buildUrl(this.baseURL, path, opts.params);
    const headers = { ...this.defaultHeaders, ...(opts.headers ?? {}) };

    const traceBase: TraceInfo = {
      from: opts.from ?? this.from,
      startedAt: Date.now(),
      attempt: 1,
      retries,
      to: { method, baseURL: this.baseURL, path, url },
      src: opts.src,
    };

    let lastError = "unknown error";
    for (let attempt = 1; attempt <= retries + 1; attempt++) {
      traceBase.attempt = attempt;
      traceBase.startedAt = Date.now();

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const init: RequestInit & NextRevalidate = {
          method,
          headers,
          signal: controller.signal,
        };
        if(typeof opts.cache !== "undefined") init.cache = opts.cache;
        if(opts.next) init.next = {...opts.next};
        if (
          method !== "GET" &&
          method !== "DELETE" &&
          typeof opts.body !== "undefined"
        ) {
          const ct = headers["Content-Type"] ?? headers["content-type"] ?? "";
          init.body = ct.includes("application/json")
            ? (JSON.stringify(opts.body) as BodyInit)
            : (opts.body as BodyInit);
        }

        const res = await fetch(url, init);
        let parsed: ApiResponse<TData> | null = null;
        try {
          parsed = (await res.json()) as ApiResponse<TData>;
        } catch {
          parsed = null;
        }

        clearTimeout(timeout);
        traceBase.endedAt = Date.now();
        traceBase.durationMs = traceBase.endedAt - traceBase.startedAt;

        if (!parsed) {
          const fallback: ApiResponseError = {
            ok: false,
            message: "Invalid JSON",
            timestamp: new Date().toISOString(),
            code: res.status,
          };
          return {
            ok: false,
            status: res.status,
            body: fallback,
            error: fallback.message,
            trace: { ...traceBase },
          };
        }

        const httpOk = res.status >= 200 && res.status < 300;

        const normalized: ApiResponse<TData> = httpOk
          ? ({
              // propagamos o resto:
              ...(parsed as ApiResponseSuccess<TData>),
              ok: true,
            } as ApiResponseSuccess<TData>)
          : ({
              ...(parsed as ApiResponseError),
              ok: false,
              message: parsed.message || `HTTP ${res.status}`,
              code: parsed.code ?? res.status,
            } as ApiResponseError
          );
        
        if(httpOk) {
          return {
            ok: true,
            status: res.status,
            body: normalized,
            trace: {...traceBase}
          };
        }
        lastError = (normalized as ApiResponseError).message ?? `HTTP ${res.status}`;
        
        // retry on 5xx
        if (res.status >= 500 && attempt <= retries) {
          await sleep(100 * attempt);
          continue;
        }

        return {
          ok: false,
          status: res.status,
          body: normalized,
          error: lastError,
          trace: { ...traceBase },
        };
      } catch (err) {
        clearTimeout(timeout);

        const isAbort = err instanceof Error && err.name === "AbortError";
        lastError = isAbort
          ? "timeout or aborted"
          : err instanceof Error
          ? err.message
          : String(err);

        if (attempt <= retries) {
          // backoff
          await sleep(100 * attempt);
          continue;
        }

        traceBase.endedAt = Date.now();
        traceBase.durationMs = traceBase.endedAt - traceBase.startedAt;

        const networkError: ApiResponseError = {
          ok: false,
          message: lastError,
          timestamp: new Date().toISOString(),
          code: 500,
          trace: [lastError],
        };
        return {
          ok: false,
          status: 500,
          body: networkError,
          error: lastError,
          trace: { ...traceBase },
        };
      }
    }

    const fallback: ApiResponseError = {
      ok: false,
      message: lastError,
      timestamp: new Date().toISOString(),
      code: 500,
    };

    return {
      ok: false,
      status: 500,
      body: fallback,
      error: lastError,
      trace: { ...traceBase },
    };
  }

  get<T>(path: string, opts?: Omit<RequestOptions, "method">) {
    return this.request<T>(path, { ...(opts ?? {}), method: "GET" });
  }
  post<T, B = unknown>(
    path: string,
    body?: B,
    opts?: Omit<RequestOptions<B>, "method">
  ) {
    return this.request<T, B>(path, { ...(opts ?? {}), method: "POST", body });
  }
  put<T, B = unknown>(
    path: string,
    body?: B,
    opts?: Omit<RequestOptions<B>, "method">
  ) {
    return this.request<T, B>(path, { ...(opts ?? {}), method: "PUT", body });
  }
  patch<T, B = unknown>(
    path: string,
    body?: B,
    opts?: Omit<RequestOptions<B>, "method">
  ) {
    return this.request<T, B>(path, { ...(opts ?? {}), method: "PATCH", body });
  }
  delete<T>(path: string, opts?: Omit<RequestOptions, "method">) {
    return this.request<T>(path, { ...(opts ?? {}), method: "DELETE" });
  }
}