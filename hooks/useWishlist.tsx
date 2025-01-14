'use client'

import * as React from "react";
import { getToken } from "@/utils/token";
import { parseJwt } from "@/utils/parseJwt";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = React.useState<WishlistItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Anda akan diarahkan ke halaman login.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const decodedToken = parseJwt(token);
      if (!decodedToken?.id) {
        toast({
          title: "Error",
          description: "Token tidak valid. Silakan login ulang.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      setUserId(decodedToken.id);

      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wishlists/user/${decodedToken.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setWishlistItems(data);
        } else {
          setError("Gagal mengambil data wishlist.");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [router, toast]);

  const handleDeleteItem = async (itemId: string) => {
    // Optimistic update
    const deletedItem = wishlistItems.find(item => item.id === itemId);
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/wishlists/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal menghapus item dari wishlist.");
      }
    } catch (error) {
      // Revert optimistic update on error
      if (deletedItem) {
        setWishlistItems((prevItems) => [...prevItems, deletedItem]);
      }
      setError("Terjadi kesalahan saat menghapus item dari wishlist.");
      toast({
        title: "Error",
        description: "Gagal menghapus item dari wishlist.",
        variant: "destructive",
      });
    }
  };

  return {
    wishlistItems,
    loading,
    error,
    handleDeleteItem,
  };
}

