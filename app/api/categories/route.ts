"use server";

import { NextResponse, NextRequest } from "next/server";
import {
  GetCategory,
  CreateCategory,
  UpdateCategory,
} from "@/types/category.type";
import { getToken } from "@/utils/token";

const fetchWithAuth = async (url: string, options: any) => {
  const token = await getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
    // Don't include Content-Type for FormData
    if (options.body instanceof FormData) {
      delete options.headers["Content-Type"];
    }
  }
  return fetch(url, options);
};

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Gagal mengambil kategori" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil kategori" },
      { status: 500 }
    );
  }
}

export async function GET_BY_ID(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const id = pathname.split("/").pop();

  if (!id) {
    return NextResponse.json(
      { error: "ID kategori diperlukan" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Kategori tidak ditemukan" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil kategori" },
      { status: 500 }
    );
  }
}

export async function GET_BY_SLUG(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Slug kategori diperlukan" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Kategori tidak ditemukan" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengambil kategori" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: "POST",
        headers: {},
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Gagal membuat kategori" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat membuat kategori" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "PUT",
        headers: {},
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Gagal memperbarui kategori" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json() as GetCategory;

    if (!id) {
      return NextResponse.json(
        { error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Gagal menghapus kategori" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: "Kategori berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus kategori" },
      { status: 500 }
    );
  }
}