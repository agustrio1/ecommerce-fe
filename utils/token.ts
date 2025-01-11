'use server';

import { cookies } from 'next/headers';

// Mendapatkan token dari cookie
export async function getToken(): Promise<string | undefined> {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (token) {
    if (await isTokenExpired(token)) {
      await clearToken(); // Panggil API untuk hapus token
      return undefined;
    }
    return token;
  }

  return undefined;
}

// Memanggil API untuk menghapus cookie
export async function clearToken() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/cookies/clear`, {
      method: 'POST',
    });

    if (!res.ok) {
      throw new Error('Failed to clear token');
    }
  } catch (error) {
    console.error('Error clearing token:', error);
  }
}


// Memeriksa apakah token sudah kadaluarsa
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
