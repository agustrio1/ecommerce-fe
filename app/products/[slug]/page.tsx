import { Suspense } from "react";
import { Metadata } from "next";
import { getProductBySlug } from "@/actions/products";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/utils/currency";
import ProductImageSlider from "@/components/ProductImageSlider";
import ProductDescription from "@/components/ProductDescription";
import Image from "next/image";
import ButtonAddToCart from "@/components/ButtonAddToCart";
import { getToken } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Weight, Tag } from 'lucide-react';
import ButtonAddToWishlist from "@/components/ButtonAddToWishlist";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
      description: "Produk yang Anda cari tidak ditemukan.",
    };
  }

  return {
    title: `${product.name} | Toko Online`,
    description: product.description,
  };
}

function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto p-4 pt-20">
      <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
      <Skeleton className="h-6 w-1/2 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="h-96 w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return notFound();
  }

  const token = getToken();

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <section className="container mx-auto p-4 pt-20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {product.name}
          </h1>
          <Badge variant="secondary" className="text-sm">
            {product.category}
          </Badge>
        </div>

        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
              {/* Image Slider */}
              <div className="relative overflow-hidden rounded-lg">
                {product.images.length > 1 ? (
                  <ProductImageSlider
                    images={product.images}
                    altText={product.name}
                  />
                ) : (
                  <Image
                    src={product.images[0]?.image || "/placeholder.jpg"}
                    alt={product.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-[400px] rounded-lg shadow-lg transition-transform duration-300 hover:scale-105"
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-col gap-6 p-6">
                <ProductDescription description={product.description} />

                <div className="flex flex-col items-start gap-2">
                  <p className="text-3xl font-bold text-blue-600">
                    {formatRupiah(product.price)}
                  </p>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Package className="w-4 h-4" />
                    <p className="text-sm">Stok: {product.stock}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Weight className="w-4 h-4" />
                    <p className="text-sm">Berat: {product.weight * 1000} gram</p>
                  </div>

                  {/* Tags Section */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2 text-gray-700">
                      <Tag className="w-4 h-4" />
                      <p className="font-semibold">Tags:</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {product.tags &&
                        product.tags.map((tag: any, index: any) => (
                          <Badge key={index} variant="outline">
                            {tag.name}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div className="mt-6 w-full flex flex-col gap-4">
                    <ButtonAddToCart productId={product.id} />
                    <ButtonAddToWishlist productId={product.id} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Suspense>
  );
}

