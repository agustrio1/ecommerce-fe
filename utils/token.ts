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
