'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatRupiah } from '@/utils/currency';
import { ShoppingBag, ArrowUpDown } from 'lucide-react';

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

interface FilterProps {
  products: Product[];
}

const FilterComponent = ({ products }: FilterProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeFilter, setActiveFilter] = useState('');

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    let sortedProducts = [...products];

    switch (value) {
      case 'name-asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-12 lg:mb-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ShoppingBag className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
          Temukan Produk Kami
        </h1>
        <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
          Jelajahi koleksi produk premium kami yang dipilih dengan cermat untuk kualitas dan gaya.
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-gradient-to-r from-blue-50 to-blue-100/30 p-6 rounded-2xl">
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-blue-600" />
          <span className="text-sm md:text-base font-medium text-gray-700">
            Menampilkan {filteredProducts.length} produk
          </span>
        </div>
        
        <div className="flex items-center gap-3">
          <Label htmlFor="filter" className="text-sm md:text-base font-medium text-gray-600">
            Urutkan:
          </Label>
          <Select onValueChange={handleFilterChange} value={activeFilter}>
            <SelectTrigger className="w-[200px] bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors">
              <SelectValue placeholder="Pilih urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama: A ke Z</SelectItem>
              <SelectItem value="name-desc">Nama: Z ke A</SelectItem>
              <SelectItem value="price-asc">Harga: Rendah ke Tinggi</SelectItem>
              <SelectItem value="price-desc">Harga: Tinggi ke Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {filteredProducts.map((product) => (
          <Link 
            href={`/products/${product.slug}`}
            key={product.id}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
              <Image
                src={product.images.find(image => image.isPrimary)?.image || '/placeholder.jpg'}
                alt={product.name}
                width={400}
                height={500}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-r">
              <h2 className="text-base sm:text-sm md:text-md lg:text-lg xl:text-xl font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h2>
              <div className="flex items-center justify-between p-3">
                <p className="sm:text-sm md:text-md lg:text-lg xl:text-xl font-bold text-blue-600 text-center">
                  {formatRupiah(product.price)}
                </p>
                <div className="w-8 h-8  rounded-full bg-blue-100 hidden lg:flex items-center justify-center opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0 translate-x-4 transition-all duration-300">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FilterComponent;
