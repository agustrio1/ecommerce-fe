import { useState, useEffect } from 'react';
import { getToken } from "@/utils/token";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  createdAt: string;
  total: number;
  status: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
}

export function useUserDashboard() {
  const { toast } = useToast();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
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
        setUserName(userPayload?.name || "Pengguna");

        if (!userId) {
          throw new Error("ID pengguna tidak ditemukan dalam token.");
        }

        const ordersResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!ordersResponse.ok) {
          throw new Error("Gagal mengambil data pesanan.");
        }

        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.data.slice(0, 5));

        const totalOrders = ordersData.data.length;
        const totalSpent = ordersData.data.reduce(
          (sum: number, order: Order) => sum + order.total,
          0
        );
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        setUserStats({
          totalOrders,
          totalSpent,
          averageOrderValue,
        });
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

    fetchData();
  }, [toast]);

  return { recentOrders, userStats, loading, userName };
}

