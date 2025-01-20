'use client'

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/shippings/StatusBadge";
import { getToken } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentStatus, Shipping } from "@/types/shipping.type";
import { formatRupiah } from "@/utils/currency";
import { convertKgtoGram } from "@/utils/convert";
import { format } from "date-fns";
import { ShippingDetailDialog } from "@/components/user/shippinghistory/ShippingDetailDialog";
import { Search, Package } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { ChevronRight } from 'lucide-react';

const truncateString = (str: string, num: number) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + '...';
};

export const ShippingHistory = () => {
  const [data, setData] = React.useState<Shipping[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedShipping, setSelectedShipping] = React.useState<Shipping | null>(null);

  const fetchData = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
  
      if (!token) {
        throw new Error("Token tidak tersedia. Harap login kembali.");
      }
  
      const userPayload = JSON.parse(atob(token.split(".")[1]));
      const userId = userPayload.id;
  
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });

      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
  
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shippings/user/${userId}?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to load shipping data");
      }
  
      const result = await response.json();
      setData(result.data);
      setTotal(result.meta.total);
    } catch (error: any) {
      setError(error.message || "An error occurred while loading data");
      console.error("Shipping history error:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = React.useCallback(
    React.useMemo(
      () =>
        debounce((value: string) => {
          setSearchTerm(value);
          setPage(1);
        }, 500),
      []
    ),
    []
  );

  React.useEffect(() => {
    fetchData(page);
  }, [page, searchTerm]);

  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "yyyy-MM-dd HH:mm");
  };

  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold flex items-center">
            <Package className="mr-2" />
            Riwayat Pengiriman
          </h2>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari pengiriman..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 text-center">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data pengiriman
          </div>
        ) : (
          <div className="overflow-x-auto">
            {isMobile ? (
              <div className="space-y-4">
                {data.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{index + 1}</p>
                        <p className="text-sm text-gray-500">{item.courier.toUpperCase()}</p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{truncateString(item.originCity, 15)} → {truncateString(item.destinationCity, 15)}</p>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <p className="text-sm text-gray-500">{formatDate(item.createdAt)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedShipping(item)}
                      >
                        Detail <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No</TableHead>
                    <TableHead>Kota Asal</TableHead>
                    <TableHead>Kota Tujuan</TableHead>
                    <TableHead>Kurir</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>No. Resi</TableHead>
                    <TableHead>Dikirim</TableHead>
                    <TableHead>Diantar</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item.originCity}</TableCell>
                      <TableCell>{item.destinationCity}</TableCell>
                      <TableCell>{item.courier.toUpperCase()}</TableCell>
                      <TableCell>
                        <StatusBadge status={item.status} />
                      </TableCell>
                      <TableCell>{item.trackingNumber || "-"}</TableCell>
                      <TableCell>{formatDate(item.shippedAt)}</TableCell>
                      <TableCell>{formatDate(item.deliveredAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedShipping(item)}
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-600">
            Halaman {page} dari {Math.ceil(total / limit)}
          </span>
          <Button
            variant="outline"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Berikutnya
          </Button>
        </div>
      </CardFooter>
      {selectedShipping && (
        <ShippingDetailDialog
          shipping={selectedShipping}
          onClose={() => setSelectedShipping(null)}
        />
      )}
    </Card>
  );
};

const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  
  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  
  debounced.cancel = () => {
    clearTimeout(timeout);
  };
  
  return debounced;
};

