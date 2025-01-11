"use client";

import React from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Users, DollarSign, TrendingUp, Package, ShoppingBag, Boxes, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { data, loading, error } = useDashboardData();

  const handleGenerateReport = () => {
    const csvContent = [
      ["Title", "Value"],
      ["Total Users", data?.totalUsers || 0],
      ["Total Orders", data?.totalOrders || 0],
      ["Total Revenue", `Rp${(data?.totalRevenue || 0).toLocaleString()}`],
      ["Average Order Value", `Rp${(data?.averageOrderValue || 0).toLocaleString()}`],
      ["Total Products", data?.totalProducts || 0],
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "dashboard_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );

  if (loading) {
    return <div className="p-6 space-y-6 bg-gray-50 min-h-screen">{renderSkeleton()}</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  const orderStatusColors: Record<string, string> = {
    success: "bg-green-500",
    canceled: "bg-yellow-500",
    failed: "bg-red-500",
    pending: "bg-blue-500",
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleGenerateReport}>
          <BarChart className="mr-2 h-4 w-4" /> Buat Laporan
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Pengguna"
          value={data?.totalUsers || 0}
          icon={<Users className="h-6 w-6 text-blue-500" />}
        />
        <DashboardCard
          title="Total Pesanan"
          value={data?.totalOrders || 0}
          icon={<Package className="h-6 w-6 text-purple-500" />}
        />
        <DashboardCard
          title="Pendapatan Total"
          value={data?.totalRevenue || 0}
          formattedValue={`Rp${(data?.totalRevenue || 0).toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-green-500" />}
        />
        <DashboardCard
          title="Rata-rata Nilai Pesanan"
          value={data?.averageOrderValue || 0}
          formattedValue={`Rp${(data?.averageOrderValue || 0).toLocaleString()}`}
          icon={<TrendingUp className="h-6 w-6 text-orange-500" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Statistik Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            {data?.orderStats && (
              <div className="space-y-4">
                {Object.entries(data.orderStats).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">{status}</span>
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                    <Progress
                      value={(count / data.totalOrders) * 100}
                      className={`h-2 ${orderStatusColors[status] || "bg-gray-300"}`}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-4 w-4" /> Kelola Pengguna
            </Button>
            <Button className="w-full" variant="outline">
              <Package className="mr-2 h-4 w-4" /> Lihat Pesanan
            </Button>
            <Button className="w-full" variant="outline">
              <ShoppingBag className="mr-2 h-4 w-4" /> Kelola Produk
            </Button>
            <Button className="w-full" variant="outline">
              <Boxes className="mr-2 h-4 w-4" /> Cek Inventaris
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Ikhtisar Produk</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Total Produk</span>
            <span className="text-3xl font-bold text-blue-600">{data?.totalProducts || 0}</span>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            <ShoppingBag className="mr-2 h-4 w-4" /> Lihat Semua Produk
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
