import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Token cleared' });
  response.cookies.set('token', '', { maxAge: 0 });
  return response;
}
