'use client'

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/utils/token";
import { Order, OrdersResponse } from "@/types/order.type";      

export const useOrderHistory = () => {
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [limit] = React.useState(9); // Jumlah item per halaman

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

        const userPayload = JSON.parse(atob(token.split(".")[1]));
        const userId = userPayload?.id;

        if (!userId) {
          throw new Error("ID pengguna tidak ditemukan dalam token.");
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}?page=${currentPage}&limit=${limit}`;
        const response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Gagal mengambil data pesanan.");
        }

        const result: OrdersResponse = await response.json();
        setOrders(result.data);
        setTotalPages(result.meta.totalPages);
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
  }, [toast, currentPage, limit]);

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
    setCurrentPage
  };
};