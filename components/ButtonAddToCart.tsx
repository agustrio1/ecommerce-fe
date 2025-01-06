"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/token";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from 'lucide-react';

export default function AddToCart({ productId }: { productId: string }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Silakan login ulang.",
          variant: "destructive",
        });
        return;
      }

      const userPayload = JSON.parse(atob(token.split(".")[1]));
      const userId = userPayload.id;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: 1, userId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menambahkan ke keranjang");
      }

      const responseData = await res.json();
      toast({
        title: "Sukses",
        description: responseData.message || "Produk berhasil ditambahkan ke keranjang",
      });
    } catch (error) {
      console.error("Add to cart error:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menambahkan produk ke keranjang.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading} 
      className="w-full h-12 text-base font-semibold transition-all duration-300 transform hover:scale-105"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
      ) : (
        <ShoppingCart className="mr-2 h-5 w-5" />
      )}
      {isLoading ? "Menambahkan..." : "Tambah ke Keranjang"}
    </Button>
  );
}

