import { useState, useEffect } from "react";
import { getToken } from "@/utils/token";

interface DashboardData {
  totalUsers: number;
  orderStats: {
    success: number;
    canceled: number;
    failed: number;
    pending: number;
  };
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalProducts: number;
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Token tidak ditemukan. Harap login ulang.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [usersResponse, ordersResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/stats/count`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/`, { headers }),
        ]);

        if (!usersResponse.ok || !ordersResponse.ok) {
          throw new Error("Gagal memuat data dashboard");
        }

        const usersData = await usersResponse.json();
        const ordersData = await ordersResponse.json();

        const totalOrders = ordersData.meta.total;
        const totalRevenue = ordersData.data.reduce(
          (sum: number, order: { total: number }) => sum + order.total,
          0
        );
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const [allOrders, allProducts] = await Promise.all([
          fetchAllItems(token, 'orders'),
          fetchAllItems(token, 'products')
        ]);

        setData({
          totalUsers: usersData.totalUsers,
          orderStats: {
            success: allOrders.filter((order: { status: string }) => order.status === 'SUCCESS').length,
            canceled: allOrders.filter((order: { status: string }) => order.status === 'CANCELED').length,
            failed: allOrders.filter((order: { status: string }) => order.status === 'FAILED').length,
            pending: allOrders.filter((order: { status: string }) => order.status === 'PENDING').length,
          },
          totalOrders,
          totalRevenue,
          averageOrderValue,
          totalProducts: allProducts.length,
        });
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Terjadi kesalahan saat memuat data dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return { data, loading, error };
};

async function fetchAllItems(token: string, itemType: 'orders' | 'products') {
  let allItems: any[] = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${itemType}/?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${itemType}`);
    }

    const data = await response.json();
    allItems = allItems.concat(data.data);

    if (data.data.length < limit) {
      break; 
    }

    page++;
  }

  return allItems;
}

