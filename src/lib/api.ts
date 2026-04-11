export function getApiBaseUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").trim();
  const base = raw.length > 0 ? raw : "http://localhost:4000";
  return base.replace(/\/$/, "");
}

export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type Json = Record<string, unknown>;

async function parseJsonSafe(res: Response): Promise<Json | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as Json;
  } catch {
    return null;
  }
}

export async function apiGet<T>(path: string, token?: string | null): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}${path}`, { headers, credentials: "omit" });
  const body = await parseJsonSafe(res);

  if (!res.ok) {
    const msg =
      (body?.error as string) ||
      (body?.message as string) ||
      res.statusText ||
      "Request failed";
    const code = body?.code as string | undefined;
    throw new ApiError(res.status, msg, code);
  }

  return body as T;
}

export async function apiPost<T>(
  path: string,
  data: unknown,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
    credentials: "omit",
  });
  const body = await parseJsonSafe(res);

  if (!res.ok) {
    const msg =
      (body?.error as string) ||
      (body?.message as string) ||
      res.statusText ||
      "Request failed";
    const code = body?.code as string | undefined;
    throw new ApiError(res.status, msg, code);
  }

  return body as T;
}

export async function apiDelete(
  path: string,
  token?: string | null,
): Promise<void> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "DELETE",
    headers,
    credentials: "omit",
  });

  if (res.status === 204) return;

  const body = await parseJsonSafe(res);
  if (!res.ok) {
    const msg =
      (body?.error as string) ||
      (body?.message as string) ||
      res.statusText ||
      "Request failed";
    const code = body?.code as string | undefined;
    throw new ApiError(res.status, msg, code);
  }
}
