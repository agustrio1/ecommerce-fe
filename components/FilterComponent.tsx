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

  const handleFilterChange = (value: string) => {
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
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-start">
          <Label htmlFor="filter" className="font-semibold mb-2">Urutkan berdasarkan:</Label>
          <Select onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48 border-gray-300">
              <SelectValue placeholder="Pilih urutan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Nama: A-Z</SelectItem>
              <SelectItem value="name-desc">Nama: Z-A</SelectItem>
              <SelectItem value="price-asc">Harga: Terendah ke Tertinggi</SelectItem>
              <SelectItem value="price-desc">Harga: Tertinggi ke Terendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <li key={product.id} className="border rounded-lg shadow-lg p-4 bg-white hover:shadow-xl transition-shadow">
            <Link href={`/products/${product.slug}`}>
              <Image
                src={product.images.find(image => image.isPrimary)?.image || '/placeholder.jpg'}
                alt={product.name}
                width={400}
                height={300}
                fetchPriority="high"
                priority
                className="w-full h-60 object-cover rounded-lg"
              />
              <h2 className="text-lg text-center font-semibold mt-4 text-gray-900">{product.name}</h2>
              <p className="font-bold text-center text-gray-700 mt-2">{formatRupiah(product.price)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FilterComponent;
