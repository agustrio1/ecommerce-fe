"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import { getToken } from "@/utils/token";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function UserDashboard() {
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

        // Fetch orders
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
        console.log(ordersData);
        setRecentOrders(ordersData.data.slice(0, 5));

        // Calculate user stats
        const totalOrders = ordersData.data.length;
        const totalSpent = ordersData.data.reduce(
          (sum: number, order: Order) => sum + order.total,
          0
        );
        const averageOrderValue =
          totalOrders > 0 ? totalSpent / totalOrders : 0;

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-500";
      case "processing":
        return "bg-yellow-500";
      case "shipped":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat datang, {userName}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Berikut adalah ringkasan aktivitas akun Anda.
          </p>
        </div>
        <Button asChild>
          <Link href="/user/orders-history">Lihat Semua Aktivitas</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Pesanan"
          value={userStats.totalOrders.toString()}
          description="Sepanjang waktu"
          icon={<ShoppingBag className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Total Pengeluaran"
          value={`Rp ${userStats.totalSpent.toLocaleString()}`}
          description="Sepanjang waktu"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Rata-rata Nilai Pesanan"
          value={`Rp ${userStats.averageOrderValue.toLocaleString()}`}
          description="Per pesanan"
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardCard
          title="Status Akun"
          value="Aktif"
          description="Terverifikasi"
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pesanan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length > 0 ? (
                    recentOrders
                      .sort(
                        (a, b) =>
                          new Date(b.createdAt).getTime() -
                          new Date(a.createdAt).getTime()
                      )
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </TableCell>
                          <TableCell>
                            Rp {order.total.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                order.status
                              )} text-white`}>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        Belum ada pesanan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Pesanan Selesai</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(
                    ((userStats.totalOrders * 0.8) / userStats.totalOrders) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress value={80} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Pesanan dalam Proses</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(
                    ((userStats.totalOrders * 0.15) / userStats.totalOrders) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress value={15} className="mt-2" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Pesanan Dibatalkan</p>
                <span className="text-sm text-muted-foreground">
                  {Math.round(
                    ((userStats.totalOrders * 0.05) / userStats.totalOrders) *
                      100
                  )}
                  %
                </span>
              </div>
              <Progress value={5} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="h-[400px] w-full col-span-4" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
