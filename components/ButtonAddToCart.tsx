"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/token";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react"; 

export default function AddToCart({ productId }: any) {
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
        setIsLoading(false); 
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
        console.error("Backend Error:", errorData);
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
    <div className="w-full">
    <Button onClick={handleAddToCart} disabled={isLoading} className="w-full relative flex items-center justify-center">
      {isLoading && (
        <Loader2 className="animate-spin mr-2 absolute" style={{ left: "50%", transform: "translateX(-50%)" }} />
      )}
      {!isLoading ? "Tambah ke Keranjang" : "Sedang Menambahkan..."}
    </Button>
    </div>
  );
}
