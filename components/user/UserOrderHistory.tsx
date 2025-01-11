"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  Clock,
} from "lucide-react";
import { Order, OrderItem } from "@/types/order.type";
import { useOrderHistory } from "@/hooks/useOrderHistory";
import { getStatusColor } from "@/utils/getStatusColor";

const FloatingDetails = ({
  order,
  onClose,
}: {
  order: Order;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-xl">
      <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">Detail Pesanan</h3>
          <p className="text-sm text-gray-500">#{order.id}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-gray-100">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {new Date(order.createdAt).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <Badge className={`${getStatusColor(order.status)}`}>
            {order.status}
          </Badge>
        </div>

        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-6 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}/${item.product.images[0].image}`}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-medium text-lg">{item.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    Jumlah: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-right text-lg">
                  Rp {item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
            <span className="font-semibold text-lg">Total Pembayaran</span>
            <span className="font-bold text-xl text-blue-600">
              Rp {order.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

export function OrderHistory() {
  const {
    orders,
    loading,
    selectedOrder,
    handlePageChange,
    currentPage,
    totalPages,
    setSelectedOrder,
    setCurrentPage,
  } = useOrderHistory();


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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl font-bold">
              Riwayat Pesanan
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border hover:shadow-lg transition-all duration-300 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString(
                            "id-ID",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-lg font-semibold text-blue-600">
                        Rp {order.total.toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      onClick={() => setSelectedOrder(order)}>
                      Lihat Detail
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-lg font-medium">
                  Tidak ada riwayat pesanan.
                </p>
                <p className="text-sm text-gray-400">
                  Pesanan Anda akan muncul di sini.
                </p>
              </div>
            )}
          </div>

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
        <FloatingDetails
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}

export default OrderHistory;
