'use client';

import { useState, useEffect } from 'react';
import { formatRupiah } from "@/utils/currency";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: { image: string }[];
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showResults, setShowResults] = useState(false);

  const fetchProducts = async (term: string, page: number = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?search=${term}&page=${page}&limit=5`
      );
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      setResults(data.data);
      setTotalPages(data.meta.totalPages);
      setCurrentPage(data.meta.page);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching products:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      fetchProducts(searchTerm);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchProducts(searchTerm, newPage);
  };

  const handleProductClick = () => {
    setShowResults(false);
    setSearchTerm('');
  };

  return {
    searchTerm,
    results,
    isLoading,
    currentPage,
    totalPages,
    showResults,
    setShowResults,
    handleInputChange,
    handleSearch,
    handlePageChange,
    handleProductClick,
    formatRupiah,
  };
}

