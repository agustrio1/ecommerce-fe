// pages/[slug]/ProductDetailPage.tsx

import { Metadata } from "next";
import { getProductBySlug } from "../../../actions/products";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/utils/currency";
import ProductImageSlider from "@/components/ProductImageSlider";
import ProductDescription from "@/components/ProductDescription";
import Image from "next/image";
import ButtonAddToCart from "@/components/ButtonAddToCart";
import { getToken } from "@/utils/token";

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
    title: product.name,
    description: product.description,
  };
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
    <section className="container mx-auto p-4 pt-20">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-semibold mb-2">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Image Slider */}
        <div className="flex justify-center md:justify-start w-full z-[-10]">
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
              className="object-cover w-full h-96 rounded-lg shadow-lg"
            />
          )}
        </div>

        <div className="flex flex-col gap-4 justify-between mb-4">
          <ProductDescription description={product.description} />
          <div className="flex flex-col items-start mt-4">
            <p className="text-xl font-bold text-gray-900">
              {formatRupiah(product.price)}
            </p>
            <ButtonAddToCart productId={product.id} />
          </div>
        </div>
      </div>
    </section>
  );
}
