import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import CategorySection from "@/components/CategorySection";
import HeroBanner from "@/components/HeroBanner";
import FeatureSection from "@/components/FeatureSection";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  images: { image: string }[];
  description?: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

function ProductCard({ product }: { product: Product }) {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Card className="group overflow-hidden">
      <div className="aspect-square relative overflow-hidden">
        <div className="absolute top-2 right-2 z-10">
          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            Promo
          </span>
        </div>
        <Image
          src={product.images[0]?.image || ""}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name.length > 20
            ? `${product.name.slice(0, 20)}...`
            : product.name}
        </h3>
        <div className="space-y-1">
          <p className="text-lg font-bold text-blue-600">{formattedPrice}</p>
          {product.description && (
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

async function fetchCategories(): Promise<Category[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_API_URL is not set.");
  }

  const res = await fetch(`${apiUrl}/categories`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch categories");
  }

  const categories = await res.json();
  return categories;
}

async function fetchProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("Environment variable NEXT_PUBLIC_API_URL is not set.");
  }

  const res = await fetch(`${apiUrl}/products?page=1&limit=10`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const response = await res.json();
  return response.data || [];
}

export default async function HomePage() {
  try {
    const [products, categories] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
    ]);

    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        <HeroBanner />
        <FeatureSection />

        {/* Kategori */}
        <CategorySection categories={categories} />

        {/* Produk Terbaru */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Produk Terbaru</h2>
            <Link
              href="/products"
              className="text-blue-600 hover:text-blue-700 flex items-center">
              Lihat Semua <ChevronRight size={20} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <ProductCard product={product} />
                </Link>
              ))
            ) : (
              <p>Tidak ada produk tersedia.</p>
            )}
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return <div>Error loading products. Please try again later.</div>;
  }
}
