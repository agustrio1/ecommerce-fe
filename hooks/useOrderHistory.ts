'use client'

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/token";
import { OrderItem, Order } from "@/types/order.type";

export const useOrderHistory = () => {
    const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  React.useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        if (!token) {
          toast({
            title: "Error",
            description: "Token tidak ditemukan. Harap login ulang.",
            variant: "destructive",
          });
          return;
        }

        if (!token) {
          throw new Error("Token tidak ditemukan.");
        }

        const userPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = userPayload?.id;

        if (!userId) {
          throw new Error("ID pengguna tidak ditemukan dalam token.");
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}?page=${currentPage}`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan.");
        }

        const data = await response.json();
        setOrders(data.data);
        setTotalPages(data.totalPages);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Terjadi kesalahan.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [toast, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    orders,
    loading,
    selectedOrder,
    handlePageChange,
    currentPage,
    totalPages,
    setSelectedOrder,
    setCurrentPage,
    setTotalPages,
    totalOrders: orders.length,
    setLoading,
    setOrders,
    toast,
  };
};