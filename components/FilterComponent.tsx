'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/utils/currency";
import { ShoppingBag, ArrowUpDown, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

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
  totalProducts: number;
}

const FilterComponent = ({ products, totalProducts }: FilterProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeFilter, setActiveFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page
  const [isLoading, setIsLoading] = useState(true);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
    let sortedProducts = [...products];

    switch (value) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }
    setFilteredProducts(sortedProducts);
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const searchResults = products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
    setFilteredProducts(searchResults);
  };

  // Get current products for the page
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto px-4 py-8 mb-12 lg:mb-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <ShoppingBag className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Temukan Produk Kami
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Jelajahi koleksi produk premium kami yang dipilih dengan cermat untuk
          kualitas dan gaya.
        </p>
      </div>

      {/* Filter Section */}
      <Card className="mb-8 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="w-full md:w-1/3">
              <Label htmlFor="search" className="sr-only">
                Cari Produk
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="search"
                  type="text"
                  placeholder="Cari produk..."
                  className="pl-10 w-full"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Label
                htmlFor="filter"
                className="text-sm md:text-base font-medium text-gray-600">
                Urutkan:
              </Label>
              <Select onValueChange={handleFilterChange} value={activeFilter}>
                <SelectTrigger className="w-[200px] bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 transition-colors">
                  <SelectValue placeholder="Pilih urutan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Nama: A ke Z</SelectItem>
                  <SelectItem value="name-desc">Nama: Z ke A</SelectItem>
                  <SelectItem value="price-asc">
                    Harga: Rendah ke Tinggi
                  </SelectItem>
                  <SelectItem value="price-desc">
                    Harga: Tinggi ke Rendah
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Count */}
      <div className="flex items-center gap-2 mb-6">
        <ArrowUpDown className="w-5 h-5 text-blue-600" />
        <span className="text-sm md:text-base font-medium text-gray-700">
          Menampilkan {currentProducts.length} produk
        </span>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))
          : currentProducts.map((product) => (
              <Link href={`/products/${product.slug}`} key={product.id}>
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <Image
                      src={
                        product.images.find((image) => image.isPrimary)
                          ?.image || "/placeholder-card.svg"
                      }
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transform transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name.length > 20
                        ? `${product.name.slice(0, 20)}...`
                        : product.name}
                    </h2>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-blue-600">
                        {formatRupiah(product.price)}
                      </p>
                      <Button size="sm" variant="outline">
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Lihat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant="outline"
              className={`mx-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
