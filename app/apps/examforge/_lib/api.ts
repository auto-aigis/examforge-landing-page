import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  _supabase = createClient(url || "https://placeholder.supabase.co", key || "placeholder");
  return _supabase;
}

// Convenience export for direct use
export const supabase = {
  auth: {
    getSession: () => getSupabase().auth.getSession(),
    signInWithPassword: (opts: Parameters<SupabaseClient["auth"]["signInWithPassword"]>[0]) =>
      getSupabase().auth.signInWithPassword(opts),
    signUp: (opts: Parameters<SupabaseClient["auth"]["signUp"]>[0]) =>
      getSupabase().auth.signUp(opts),
    signOut: () => getSupabase().auth.signOut(),
    onAuthStateChange: (
      callback: Parameters<SupabaseClient["auth"]["onAuthStateChange"]>[0]
    ) => getSupabase().auth.onAuthStateChange(callback),
  },
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const { data: { session } } = await getSupabase().auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: "Unknown error" }));
    const err = new Error(
      typeof body.detail === "string" ? body.detail : JSON.stringify(body.detail)
    ) as Error & { status: number; body: unknown };
    (err as any).status = res.status;
    (err as any).body = body;
    throw err;
  }
  return res.json();
}

export async function apiFetchBlob(path: string): Promise<Blob> {
  const { data: { session } } = await getSupabase().auth.getSession();
  const token = session?.access_token;

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.blob();
}
