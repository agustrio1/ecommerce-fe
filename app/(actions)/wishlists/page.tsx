"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Heart, ShoppingCart } from 'lucide-react';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    slug: string;
    name: string;
    image: string;
    price: number;
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await fetch('/api/wishlist');
        if (!response.ok) throw new Error("Failed to fetch wishlist");
        setWishlistItems(await response.json());
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal memuat wishlist",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/wishlist/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete item");

      setWishlistItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Sukses",
        description: "Produk berhasil dihapus dari wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menghapus produk",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  return (
    <div className="container mx-auto pt-16 px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Heart className="h-8 w-8 text-pink-600" />
        Wishlist Saya
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Wishlist Anda masih kosong</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item, index) => (
           
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-48">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.product.name.length > 20
                        ? `${item.product.name.slice(0, 20)}...`
                        : item.product.name}</h3>
                    <p className="text-lg font-bold mb-4 text-pink-600">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>
                    <div className="flex gap-2">
                    <Link href={`/products/${item.product.slug}`} key={item.id} className="flex-1">
                      <Button
                        variant="default"
                        className="flex-1 w-full"
                        onClick={() => {/* Add to cart logic */}}
                      >
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Beli
                      </Button>
                      </Link>
                      <Button
                        variant="outline"
                        className="p-2"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

