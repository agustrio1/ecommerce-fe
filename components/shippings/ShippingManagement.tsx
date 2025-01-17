"use client";

import * as React from "react";
import { CarTaxiFrontIcon, SearchIcon, TruckIcon, PackageIcon, CheckCircleIcon, XCircleIcon, EyeIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shippings/StatusBadge";
import { ShippingDetailsDialog } from "@/components/shippings/ShippingDetailsDialog";
import { getToken } from "@/utils/token";
import { Skeleton } from "@/components/ui/skeleton";
import { ShipmentStatus, Shipping } from "@/types/shipping.type";
import { formatRupiah } from "@/utils/currency";
import { convertKgtoGram } from "@/utils/convert";

export const ShippingManagement = () => {
  const [data, setData] = React.useState<Shipping[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [limit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedShipping, setSelectedShipping] = React.useState<Shipping | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const fetchData = async (currentPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shippings?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to load shipping data");
      const result = await response.json();
      setData(result.data);
      setTotal(result.meta.total);
    } catch (error: any) {
      setError(error.message || "An error occurred while loading data");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const handleUpdateShipping = async (id: string, updateData: Partial<Shipping> | ShipmentStatus) => {
    try {
      const token = await getToken();
      const payload = typeof updateData === 'string' 
        ? { status: updateData } 
        : updateData;
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shippings/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) throw new Error("Failed to update shipping");
      const updatedData = await response.json();
      setData((prevData) =>
        prevData.map((shipment) =>
          shipment.id === id ? { ...shipment, ...updatedData } : shipment
        )
      );
      setIsDialogOpen(false);
    } catch (error: any) {
      setError(error.message || "An error occurred while updating shipping");
    }
  };

  React.useEffect(() => {
    fetchData(page);
  }, [page, searchTerm]);

  const totalPages = Math.ceil(total / limit);

  const shipmentCounts = {
    [ShipmentStatus.PENDING]: data.filter(s => s.status === ShipmentStatus.PENDING).length,
    [ShipmentStatus.PROCESSING]: data.filter(s => s.status === ShipmentStatus.PROCESSING).length,
    [ShipmentStatus.SHIPPED]: data.filter(s => s.status === ShipmentStatus.SHIPPED).length,
    [ShipmentStatus.DELIVERED]: data.filter(s => s.status === ShipmentStatus.DELIVERED).length,
    [ShipmentStatus.CANCELED]: data.filter(s => s.status === ShipmentStatus.CANCELED).length,
  };

  const statusIcons = {
    [ShipmentStatus.PENDING]: <PackageIcon className="h-8 w-8 text-yellow-500" />,
    [ShipmentStatus.PROCESSING]: <TruckIcon className="h-8 w-8 text-blue-500" />,
    [ShipmentStatus.SHIPPED]: <TruckIcon className="h-8 w-8 text-purple-500" />,
    [ShipmentStatus.DELIVERED]: <CheckCircleIcon className="h-8 w-8 text-green-500" />,
    [ShipmentStatus.CANCELED]: <XCircleIcon className="h-8 w-8 text-red-500" />,
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <CarTaxiFrontIcon className="text-primary" />
        Manajemen Pengiriman
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {Object.entries(shipmentCounts).map(([status, count]) => (
          <Card key={status}>
            <CardContent className="flex items-center justify-between p-6">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{status}</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
              {statusIcons[status as ShipmentStatus]}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold">Pengiriman</h2>
          <div className="relative">
            <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search shipments..."
              className="pl-8 w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Asal</TableHead>
              <TableHead>Tujuan</TableHead>
              <TableHead>Kurir</TableHead>
              <TableHead>Layanan</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Biaya</TableHead>
              <TableHead>Estimasi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 12 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  Tidak ada pengiriman
                </TableCell>
              </TableRow>
            ) : (
              data.map((shipping) => (
                <TableRow key={shipping.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{shipping.id}</TableCell>
                  <TableCell>{shipping.order.id}</TableCell>
                  <TableCell>
                    <div>{shipping.order.user.name}</div>
                    <div className="text-sm text-muted-foreground">{shipping.order.user.email}</div>
                  </TableCell>
                  <TableCell>{shipping.originCity}</TableCell>
                  <TableCell>{shipping.destinationCity}</TableCell>
                  <TableCell>{shipping.courier}</TableCell>
                  <TableCell>{shipping.service}</TableCell>
                  <TableCell>{convertKgtoGram(shipping.weight)} gram</TableCell>
                  <TableCell>{formatRupiah(shipping.cost)}</TableCell>
                  <TableCell>{shipping.etd}</TableCell>
                  <TableCell>
                    <StatusBadge status={shipping.status} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedShipping(shipping);
                          setIsDialogOpen(true);
                        }}
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Select
                        onValueChange={(value) => handleUpdateShipping(shipping.id, value as ShipmentStatus)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Update Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(ShipmentStatus).map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <CardFooter className="flex items-center justify-between">
          <Button
            onClick={() => handlePageChange(page - 1)}
            disabled={loading || page <= 1}
            variant="outline"
          >
            Back
          </Button>
          <span className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(page + 1)}
            disabled={loading || page >= totalPages}
            variant="outline"
          >
            Next
          </Button>
        </CardFooter>
      </Card>

      <ShippingDetailsDialog
        shipping={selectedShipping}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpdate={handleUpdateShipping}
      />
    </div>
  );
};