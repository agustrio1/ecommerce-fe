"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, User, MapPin, Phone, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order } from "@/types/order.type";
import { getStatusColor } from "@/utils/getStatusColor";
import { getToken } from "@/utils/token";
import { formatDate } from "@/utils/dateFormatter";

export default function AdminOrderPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [limit] = React.useState(10);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        setError("Token tidak ditemukan. Harap login ulang.");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders?page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal memuat data pesanan");
      }

      const data = await response.json();
      setOrders(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = await getToken();
      if (!token) {
        setMessage({
          type: "error",
          text: "Token tidak ditemukan. Harap login ulang.",
        });
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: orderId, status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(
          errorData.message || "Gagal memperbarui status pesanan"
        );
      }

      const updatedOrderData = await response.json();
      const updatedOrder = updatedOrderData.data || updatedOrderData;

      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
      setSelectedOrder(updatedOrder);

      setMessage({
        type: "success",
        text: "Status pesanan berhasil diperbarui.",
      });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      setMessage({
        type: "error",
        text: err.message || "Terjadi kesalahan saat memperbarui status.",
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <PaginationButton key="1" onClick={() => setCurrentPage(1)}>
          1
        </PaginationButton>
      );
      if (startPage > 2) {
        buttons.push(
          <span key="dots1" className="px-2">
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <PaginationButton
          key={i}
          onClick={() => setCurrentPage(i)}
          active={currentPage === i}>
          {i}
        </PaginationButton>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span key="dots2" className="px-2">
            ...
          </span>
        );
      }
      buttons.push(
        <PaginationButton
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </PaginationButton>
      );
    }

    return buttons;
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg">
          <CardContent className="p-6">
            <div className="text-center text-red-500">
              <p className="text-lg font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
          {message.text}
        </div>
      )}

      <Card className="shadow-lg bg-white">
        <CardHeader className="bg-gray-100">
          <CardTitle className="text-2xl font-bold text-gray-800">Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 mb-4" />
              <p>Tidak ada pesanan saat ini.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{order.order_id || order.id.slice(-8)}</span>
                        <Badge className={`${getStatusColor(order.status)} text-xs px-2 py-1`}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{order.address?.user?.name || 'Nama tidak tersedia'}</span>
                      </div>
                      <div className="text-sm font-medium text-gray-800">
                        Total: Rp {order.total.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <Button
                      onClick={() => setSelectedOrder(order)}
                      className="shrink-0 bg-blue-500 hover:bg-blue-600 text-white">
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="h-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {renderPaginationButtons()}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="h-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-xl text-gray-800">
                  Detail Pesanan #{selectedOrder.id.slice(-8) || selectedOrder.order_id}
                </h3>
                <Badge
                  className={`mt-2 ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedOrder(null)}
                className="rounded-full hover:bg-gray-100">
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-5 w-5 text-gray-500" />
                    <span className="font-medium text-gray-800">
                      {selectedOrder.address?.user?.name || 'Nama tidak tersedia'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-500 mt-1" />
                    <span className="text-gray-600">
                      {selectedOrder.address?.address1 || ''},
                      {selectedOrder.address?.address2 ? ` ${selectedOrder.address.address2},` : ''}
                      {selectedOrder.address?.city || ''},
                      {selectedOrder.address?.state || ''}
                      {selectedOrder.address?.postalCode || ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <span className="text-gray-600">{selectedOrder.address?.phone || 'Nomor telepon tidak tersedia'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedOrder.orderItems?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border rounded-lg bg-white shadow-sm">
                      <Package className="h-6 w-6 text-gray-500 shrink-0" />
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-800">{item.product?.name || 'Nama produk tidak tersedia'}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          {item.product?.images?.[0]?.image ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.product.images[0].image}`}
                              alt={item.product.name || 'Product image'}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                          <div>
                            <p className="text-sm text-gray-600">
                              {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                            </p>
                            <p className="font-medium text-gray-800 mt-1">
                              Rp {(item.quantity * item.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600">Total</span>
                    <span className="font-bold text-lg text-gray-800">
                      Rp {selectedOrder.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <label htmlFor="status" className="font-medium text-gray-700 block mb-2">
                    Ubah Status Pesanan:
                  </label>
                  <select
                    id="status"
                    className="w-full p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value)
                    }>
                    <option value="PENDING">PENDING</option>
                    <option value="CHALLENGE">CHALLENGE</option>
                    <option value="SUCCESS">SUCCESS</option>
                    <option value="CANCELED">CANCELED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const PaginationButton = ({ children, onClick, disabled, active }: any) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={onClick}
    disabled={disabled}
    className={`h-8 min-w-[2rem] ${
      active ? "bg-blue-600 text-white hover:bg-blue-700" : ""
    }`}>
    {children}
  </Button>
);

