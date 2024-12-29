import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { ChevronLeft } from 'lucide-react';
import { ProductGrid } from '@/components/categories/ProductGrid';
import { FilterButton } from '@/components/categories/FillterButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Category {
  id: string;
  name: string;
  image: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: { image: string }[];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const categoryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${params.slug}`);
    const categoryData = await categoryRes.json();
    return { 
      title: categoryData?.name ? `${categoryData.name} | Toko Kami` : 'Kategori Tidak Ditemukan',
      description: `Jelajahi koleksi ${categoryData?.name} terbaik kami di Toko Kami.`,
    };
  } catch (error) {
    return { 
      title: 'Kategori Tidak Ditemukan',
      description: 'Maaf, kategori yang Anda cari tidak ditemukan.',
    };
  }
}

function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm p-4">
      <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  let categoryData: Category | null = null;
  let products: Product[] = [];

  try {
    const [categoryRes, productsRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${params.slug}`),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/category/${params.slug}`)
    ]);

    if (!categoryRes.ok) return notFound();

    categoryData = await categoryRes.json();
    const productsData = await productsRes.json();
    products = Array.isArray(productsData) ? productsData : [];
  } catch {
    return notFound();
  }

  if (!categoryData) return notFound();

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
        <Image
          src={categoryData.image || "/placeholder-card.svg"}
          alt={categoryData.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight">
            {categoryData.name}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-200 max-w-xl">
            Temukan koleksi {categoryData.name} terbaik kami untuk gaya Anda yang unik
          </p>
        </div>
      </header>

      <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <Link href="/products" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              <span className="text-sm font-medium">Kembali ke Produk</span>
            </Link>
            <div className="flex items-center space-x-4 w-full sm:w-auto">
              <FilterButton />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low-to-high">Harga: Rendah ke Tinggi</SelectItem>
                  <SelectItem value="high-to-low">Harga: Tinggi ke Rendah</SelectItem>
                  <SelectItem value="newest">Terbaru</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl text-gray-600">Belum ada produk tersedia dalam kategori ini.</h2>
          </div>
        ) : (
          <Suspense fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          }>
            <ProductGrid products={products as any} />
          </Suspense>
        )}
      </section>

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Berlangganan Newsletter</h2>
              <p className="text-blue-100 mb-6">Dapatkan update terbaru tentang produk dan promo spesial kami.</p>
            </div>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-grow px-4 py-2 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-100 transition-colors"
              >
                Berlangganan
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

