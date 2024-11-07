"use server";

import { NextResponse } from "next/server";
import { ResetPasswordData } from "@/types/auth.type";

export async function POST(request: Request) {
  try {
    const { email, newPassword, token } =
      (await request.json()) as ResetPasswordData;

    if (!email || !newPassword || !token) {
      return NextResponse.json(
        { error: "Semua field harus diisi" },
        { status: 400 }
      );
    }

    // Mengirim request ke backend Express API untuk reset password
    const expressRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, token }),
      }
    );

    if (!expressRes.ok) {
      const errorData = await expressRes.json();
      return NextResponse.json(
        { error: errorData.message || "Gagal reset password" },
        { status: expressRes.status }
      );
    }

    return NextResponse.json(
      { message: "Reset password berhasil" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
