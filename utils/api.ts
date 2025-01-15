import { getToken } from "@/utils/token";

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getToken();
  if (!token) throw new Error("Token not found");

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, {
    ...options,
    headers,
  });
}

