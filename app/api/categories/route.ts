import { NextResponse, NextRequest } from "next/server";
import { getToken } from "@/utils/token";

const fetchWithAuth = async (url: string, options: any) => {
  const token = await getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
    if (options.body instanceof FormData) {
      delete options.headers["Content-Type"];
    }
  }
  return fetch(url, options);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const slug = searchParams.get('slug');

  let url = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

  if (id) {
    url += `/${id}`;
  } else if (slug) {
    url += `/slug/${slug}`;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch category" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching the category" },
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
        { error: errorData.error || "Failed to create category" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while creating the category" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get("id");
    const name = formData.get("name");
    const image = formData.get("image");

    if (!id) {
      return NextResponse.json(
        { error: "ID kategori diperlukan" },
        { status: 400 }
      );
    }

    const newFormData = new FormData();
    newFormData.append('name', name as string);
    if (image) {
      newFormData.append('images', image as File);
    }

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "PUT",
        headers: {},
        body: newFormData,
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
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memperbarui kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

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
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat menghapus kategori" },
      { status: 500 }
    );
  }
}