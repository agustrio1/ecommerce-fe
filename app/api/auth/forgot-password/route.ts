'use server'

import { NextResponse } from "next/server"
import { ForgotPasswordData } from "@/types/auth.type"

export async function POST(request: Request) {
    try {
        const { email } = (await request.json()) as ForgotPasswordData;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })

        // Jika gagal, return respons
        if (!res.ok) {
            const errorData = await res.json();
            return NextResponse.json({ error: errorData.message || 'Forgot password failed' }, { status: res.status });
        }

        return NextResponse.json({ message: "Forgot password successful" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
}