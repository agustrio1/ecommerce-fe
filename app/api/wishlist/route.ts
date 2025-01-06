import { NextResponse } from 'next/server';
import { getToken } from "@/utils/token";

export async function GET() {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = JSON.parse(atob(token.split(".")[1])).id;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/wishlists/user/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch wishlist");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const token = await getToken();
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    const userId = JSON.parse(atob(token.split(".")[1])).id;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to add to wishlist");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

