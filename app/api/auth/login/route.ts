'use server'

import { NextResponse } from "next/server"
import { LoginData } from "@/types/auth.type"

export async function POST(request: Request) {
    try {
        const { email, password } = (await request.json()) as LoginData;

        if (!email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {    
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        // Jika gagal, return respons
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message || 'Login failed' }, { status: res.status });
        }

        const { token } = await res.json();

        const response = NextResponse.json({ message: "Login successful" });

        // Set cookie dengan token
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000 * 24 * 7,
        });

        return response;

    } catch (error) {   
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}
