import { Suspense } from 'react';
import { Metadata } from 'next';
import { getProducts } from '@/actions/products';
import FilterComponent from '@/components/FilterComponent';
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImage {
  isPrimary: boolean;
  image: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  images: ProductImage[];
  slug: string;
}

export const metadata: Metadata = {
  title: 'Produk Kami | Agus Store',
  description: 'Temukan berbagai produk terbaik kami dengan kualitas premium dan gaya yang elegan.',
};

function ProductSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-12 w-64 mb-4" />
      <Skeleton className="h-6 w-full max-w-2xl mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function Page() {
  const { products, meta } = await getProducts(); 

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white min-h-screen pt-16">
      <Suspense fallback={<ProductSkeleton />}>
      <FilterComponent products={products} totalProducts={meta.totalPages} />
      </Suspense>
    </section>
  );
}

