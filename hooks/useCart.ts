'use client'

import * as React from "react";
import { getToken } from "@/utils/token";
import { parseJwt } from "@/utils/parseJwt";
import { useToast } from "@/hooks/use-toast";
import { formatRupiah } from "@/utils/currency";
import { useRouter } from "next/navigation";

interface CartImage {
  image: string;
}

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    images?: CartImage[];
  };
}

export function useCart() {
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  React.useEffect(() => {
    const fetchCartItems = async () => {
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
          `${process.env.NEXT_PUBLIC_API_URL}/carts/users/${decodedToken.id}`,
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
          setCartItems(data);
        } else {
          setError("Gagal mengambil data keranjang.");
        }
      } catch (error) {
        setError("Terjadi kesalahan saat mengambil data keranjang.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [router, toast]);

  const handleUpdateQuantity = async (
    cartItemId: string,
    operation: "increase" | "decrease"
  ) => {
    setLoading(true);

    try {
      const token = await getToken();
      if (!token) {
        toast({
          title: "Error",
          description: "Token tidak ditemukan. Silakan login ulang.",
          variant: "destructive",
        });
        router.push("/login");
        return;
      }

      const currentItem = cartItems.find((item) => item.id === cartItemId);
      if (!currentItem) {
        toast({
          title: "Error",
          description: "Item tidak ditemukan di keranjang.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const newQuantity =
        operation === "increase"
          ? currentItem.quantity + 1
          : currentItem.quantity - 1;

      if (newQuantity < 1) {
        await handleDeleteItem(cartItemId);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carts/${cartItemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity: newQuantity,
            productId: currentItem.product.id,
            userId,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal memperbarui kuantitas.");
      }

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      );

      toast({
        title: "Sukses",
        description: "Kuantitas berhasil diperbarui.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memperbarui kuantitas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    const token = await getToken();
    if (!token) return;

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/carts/${itemId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== itemId)
        );
      } else {
        setError("Gagal menghapus item.");
      }
    } catch (error) {
      setError("Terjadi kesalahan saat menghapus item.");
    } finally {
      setLoading(false);
    }
  };

  return {
    cartItems,
    loading,
    error,
    handleUpdateQuantity,
    handleDeleteItem,
  };
}
