"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/currency";
import { Trash2, Plus, Minus, Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart"; 
export default function CartPage() {
  const { cartItems, loading, error, handleUpdateQuantity, handleDeleteItem } =
    useCart();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 pt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Keranjang Belanja Anda
        </h1>
        <div className="flex justify-center">
          <Loader2 className="mr-2 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6 pt-20">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Keranjang Belanja Anda
        </h1>
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pt-20">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
        Keranjang Belanja Anda
      </h1>

      {cartItems.length === 0 ? (
        <div className="text-center space-y-4">
          <ShoppingCart size={48} className="mx-auto text-gray-400" />
          <p className="text-xl text-gray-600">
            Keranjang Anda kosong. Mari mulai belanja!
          </p>
          <Button
            onClick={() => (window.location.href = "/products")}
            className="mt-4 bg-blue-600 text-white hover:bg-blue-700 transition px-6 py-2 rounded-lg font-semibold">
            Mulai Belanja
          </Button>
        </div>
      ) : (
        <ul className="space-y-6">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="bg-white shadow-lg p-4 sm:p-6 rounded-lg flex flex-wrap sm:flex-nowrap items-center justify-between transition hover:shadow-xl">
              <div className="flex items-center space-x-4 sm:space-x-6 w-full sm:w-auto">
                <div className="w-24 h-24 sm:w-28 sm:h-28 relative">
                  <Image
                    src={
                      item.product?.images?.length &&
                      item.product.images.length > 0
                        ? item.product.images[0]?.image
                        : "/placeholder-card.jpg"
                    }
                    alt={item.product?.name || "Product image"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-md object-cover"
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                    {item.product?.name}
                  </h3>
                  <div className="text-sm text-gray-500 mt-2">
                    Jumlah: <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div className="font-bold text-lg sm:text-2xl text-gray-800 mt-2">
                    {formatRupiah(item.product?.price * item.quantity)}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
                <Button
                  onClick={() => handleUpdateQuantity(item.id, "increase")}
                  variant="outline"
                  className="text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition w-12 h-12 flex items-center justify-center">
                  <Plus size={24} />
                </Button>
                <Button
                  onClick={() => handleUpdateQuantity(item.id, "decrease")}
                  variant="outline"
                  className="text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-white transition w-12 h-12 flex items-center justify-center">
                  <Minus size={24} />
                </Button>
                <Button
                  onClick={() => handleDeleteItem(item.id)}
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition w-12 h-12 flex items-center justify-center">
                  <Trash2 size={24} />
                </Button>
              </div>
            </li>
          ))}
          {cartItems.length > 0 && (
            <div className="text-left font-semibold text-xl mt-6">
              Total Harga:{" "}
              {formatRupiah(
                cartItems.reduce(
                  (total, item) => total + item.product.price * item.quantity,
                  0
                )
              )}
            </div>
          )}
        </ul>
      )}
      {cartItems.length > 0 && (
        <Button
          onClick={() => alert("Proceeding to checkout...")}
          className="mt-8 w-full py-3 sm:py-4 bg-blue-600 text-white rounded-lg text-base sm:text-lg font-semibold shadow-lg hover:bg-blue-700 transition">
          Lanjutkan ke Pembayaran
        </Button>
      )}
    </div>
  );
}
