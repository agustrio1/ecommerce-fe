'use server'

import { NextResponse } from "next/server"
import { RegisterData } from "@/types/auth.type"

export async function POST(request: Request) {
    try {
        const { name, email, password } = (await request.json()) as RegisterData;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        if (password.length < 8) {
            return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        // Jika gagal, return respons
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message || 'Registration failed' }, { status: res.status });
        }

        // Jika sukses, return respons
        return NextResponse.json(await res.json());
        
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
