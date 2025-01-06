"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ButtonAddToWishlist({ productId }: { productId: string }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isAdded, setIsAdded] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Cek status wishlist di localStorage
      const storedWishlist = localStorage.getItem("wishlist") || "[]";
      const wishlist = JSON.parse(storedWishlist);
      setIsAdded(wishlist.includes(productId));
    }
  }, [productId]);

  const handleAddToWishlist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) throw new Error("Failed to add to wishlist");

      setIsAdded(true);

      // Simpan status ke localStorage
      if (typeof window !== "undefined") {
        const storedWishlist = localStorage.getItem("wishlist") || "[]";
        const wishlist = JSON.parse(storedWishlist);
        wishlist.push(productId);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }

      toast({
        title: "Sukses",
        description: "Produk berhasil ditambahkan ke wishlist",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menambahkan ke wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToWishlist}
      disabled={isLoading || isAdded}
      variant="outline"
      className={cn(
        "rounded-full p-0 w-12 h-12 shadow-lg transition-all duration-300 ease-in-out",
        isAdded ? "bg-pink-100 border-pink-300 text-pink-600" : "bg-white hover:bg-gray-100",
        isLoading && "animate-pulse"
      )}
      aria-label={isLoading ? "Menambahkan ke Wishlist" : isAdded ? "Ditambahkan ke Wishlist" : "Tambah ke Wishlist"}
    >
      <Heart
        className={cn(
          "h-6 w-6 transition-all duration-300 ease-in-out",
          isAdded ? "fill-pink-600 text-pink-600" : "text-gray-600"
        )}
      />
    </Button>
  );
}
