import { buildUrl, sleep } from "./helper";
import type {
  ApiResponse,
  ApiResponseError,
  HttpResult,
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
        const init: RequestInit = {
          method,
          headers,
          signal: controller.signal,
        };
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
        let parsed = (await res.json()) as ApiResponse<TData>;
        if (!parsed) {
          parsed = {
            message: "Invalid JSON",
            timestamp: new Date().toISOString(),
            code: res.status,
          } as ApiResponseError<TData>;
        }

        clearTimeout(timeout);
        traceBase.endedAt = Date.now();
        traceBase.durationMs = traceBase.endedAt - traceBase.startedAt;

        const okHttp = res.status >= 200 && res.status < 300;
        const appOk =
          "code" in parsed &&
          parsed.code >= 200 &&
          parsed.code < 300 &&
          "data" in parsed;

        if (okHttp && appOk && "data" in parsed) {
          return {
            ok: true,
            status: res.status,
            body: parsed,
            trace: { ...traceBase },
          };
        }

        lastError = parsed.message ?? `HTTP ${res.status}`;
        // retry on 5xx
        if (res.status >= 500 && attempt <= retries) {
          await sleep(100 * attempt);
          continue;
        }

        const result: HttpResult<TData> = {
          ok: false,
          status: res.status,
          body: parsed,
          error: lastError,
          trace: { ...traceBase },
        };
        return result;
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

        return {
          ok: false,
          status: 500,
          error: lastError,
          trace: { ...traceBase },
        };
      }
    }

    return {
      ok: false,
      status: 500,
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