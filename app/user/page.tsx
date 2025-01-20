"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Package, TrendingUp, AlertCircle, Download, Eye } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useUserDashboard } from "@/hooks/useUserDashboard"
import { useCSVGenerator } from "@/hooks/useCSVGenerator"
import { getProgressColor, getStatusColor } from "@/utils/getStatusColor"
import { Skeleton } from "@/components/ui/skeleton"
import { nanoid } from "nanoid"

export default function UserDashboard() {
  const { recentOrders, userStats, loading, userName, orderStatusStats } = useUserDashboard()
  const { generateCSV, downloadCSV } = useCSVGenerator(recentOrders)

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row justify-between items-start md:items-center p-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Selamat datang, {userName}!</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Berikut adalah ringkasan aktivitas akun Anda.
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={generateCSV}>
                <Eye className="mr-2 h-4 w-4" />
                Pratinjau CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Pratinjau CSV</DialogTitle>
                <DialogDescription>Berikut adalah pratinjau dari file CSV yang akan diunduh.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 max-h-96 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Pesanan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.order_id || order.id}</TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell>Rp {order.total.toLocaleString()}</TableCell>
                        <TableCell>{order.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          <Button onClick={downloadCSV} variant="default">
            <Download className="mr-2 h-4 w-4" />
            Unduh CSV
          </Button>
          <Button asChild>
            <Link href="/user/orders-history">Lihat Semua Aktivitas</Link>
          </Button>
        </div>
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
          value={`Rp ${Math.round(userStats.averageOrderValue).toLocaleString()}`}
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pesanan Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.length > 0 ? (
                    recentOrders
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.order_id || nanoid(8)}</TableCell>
                          <TableCell>
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </TableCell>
                          <TableCell>Rp {order.total.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} text-white`}>{order.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
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
            {Object.entries(orderStatusStats).map(([status, percentage]) => (
              <OrderStatistic
                key={status}
                label={`Pesanan ${status}`}
                value={Math.round(percentage)}
                status={status.toLowerCase()}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardCard({
  title,
  value,
  description,
  icon,
}: {
  title: string
  value: string
  description: string
  icon: React.ReactNode
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
  )
}

function OrderStatistic({ label, value, status }: { label: string; value: number; status: string }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        <span className="text-sm text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} className={cn("mt-2", getProgressColor(status))} />
    </div>
  )
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
  )
}

