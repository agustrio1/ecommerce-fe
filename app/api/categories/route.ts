"use server";

import { NextResponse, NextRequest } from "next/server";
import {
  GetCategory,
  CreateCategory,
  UpdateCategory,
} from "@/types/category.type";
import { getToken } from "@/utils/token";

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Make a fetch request to the given URL with the given options, but first
 * attempt to get a token from local storage and add it to the Authorization
 * header if it exists.
 * @param {string} url The URL to request
 * @param {any} options The options to pass to fetch
 * @return {Promise<Response>} The response from the fetch request
 */
/******  af87288a-9322-447b-9a1e-61464332f1bd  *******/
const fetchWithAuth = async (url: string, options: any) => {
  const token = await getToken();
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
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
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred while fetching categories" },
      { status: 500 }
    );
  }
}

export async function GET_BY_ID(request: NextRequest) {
  // Mengambil ID dari URL params
  const { pathname } = request.nextUrl;
  const id = pathname.split("/").pop(); // Mengambil bagian terakhir dari URL sebagai ID

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required" },
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
      const errorData = await res.json(); // Ambil pesan kesalahan dari respon
      return NextResponse.json(
        { error: errorData.message || "Failed to fetch category" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET_BY_ID Error:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the category" },
      { status: 500 }
    );
  }
}

export async function GET_BY_SLUG(request: any) {
  const { searchParams } = request;
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json(
      { error: "Category slug is required" },
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
      return NextResponse.json(
        { error: "Failed to fetch category" },
        { status: 500 }
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
    const { name } = (await request.json()) as CreateCategory;

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
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
    const { id, name } = (await request.json()) as UpdateCategory;

    // Validate the input
    if (!id || !name) {
      return NextResponse.json(
        { error: "Category ID and name are required" },
        { status: 400 }
      );
    }

    const res = await fetchWithAuth(
      `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(
        { error: errorData.message || "Failed to update category" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the category" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = (await request.json()) as GetCategory;

    // Validate the input
    if (!id) {
      return NextResponse.json(
        { error: "Category ID is required" },
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
        { error: errorData.message || "Failed to delete category" },
        { status: res.status }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the category" },
      { status: 500 }
    );
  }
}
