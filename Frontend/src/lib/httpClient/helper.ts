import type { RequestOptions } from "./types";

export function buildUrl(
  base: string,
  path: string,
  params?: RequestOptions["params"]
): string {
  const cleanBase = base.replace(/\/+$/u, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${cleanBase}${p}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) =>
      url.searchParams.set(k, String(v))
    );
  }
  return url.toString();
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}