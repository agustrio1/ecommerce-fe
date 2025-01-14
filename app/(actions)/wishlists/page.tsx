"use client";

import { useWishlist } from "@/hooks/useWishlist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, Heart } from 'lucide-react';
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlistItems, loading, error, handleDeleteItem } = useWishlist();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-red-500">{error}</p>
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
              <Link href={`/products/${item.product?.slug || ""}`} className="block">
                <Card className="overflow-hidden h-full">
                  <CardContent className="p-0 flex flex-col h-full">
                    <div className="relative h-48">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <div>
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {item.product.name.length > 20
                            ? `${item.product.name.slice(0, 20)}...`
                            : item.product.name}
                        </h3>
                        <p className="text-lg font-bold mb-4 text-pink-600">
                          Rp {item.product.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <Button
                          variant="outline"
                          className="p-2 w-full"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDeleteItem(item.id);
                          }}
                        >
                          <Trash2 className="h-5 w-5 text-red-500 mr-2" />
                          Hapus dari Wishlist
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

