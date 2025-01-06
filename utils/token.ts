'use server'; 

import { cookies } from 'next/headers';



export async function getToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    return token;
  }

  return undefined;
}

export async function clearToken() {
  const cookieStore = cookies();
  cookieStore.set('token', '', { maxAge: -1 });
}

export async function isTokenExpired(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());

    if (!payload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}
