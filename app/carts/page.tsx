"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/utils/currency";
import { Trash2, Plus, Minus, Loader2, ShoppingCart } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cartItems, loading, error, handleUpdateQuantity, handleDeleteItem } =
    useCart();
  const router = useRouter();

  const totalPrice = React.useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Keranjang Belanja Anda
        </h1>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 pt-24">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-800">
          Keranjang Belanja Anda
        </h1>
        <p className="text-red-500 text-center text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-24">
      <h1 className="text-3xl sm:text-4xl font-bold mb-12 text-center text-gray-800">
        Keranjang Belanja Anda
      </h1>

      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <ShoppingCart size={64} className="mx-auto text-gray-400" />
          <p className="text-2xl text-gray-600">
            Keranjang Anda kosong. Mari mulai belanja!
          </p>
          <Button
            onClick={() => router.push("/products")}
            className="mt-6 bg-blue-600 text-white hover:bg-blue-700 transition px-8 py-3 rounded-full text-lg font-semibold"
          >
            Mulai Belanja
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-8">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between transition hover:shadow-xl"
              >
                <div className="flex items-center space-x-6 w-full sm:w-auto mb-4 sm:mb-0">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 relative rounded-lg overflow-hidden">
                    <Image
                      src={
                        item.product?.images?.length &&
                        item.product.images.length > 0
                          ? item.product.images[0]?.image
                          : "/placeholder-card.svg"
                      }
                      alt={item.product?.name || "Product image"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {item.product?.name}
                    </h3>
                    <div className="text-lg font-bold text-blue-600">
                      {formatRupiah(item.product?.price)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                  <div className="flex items-center border border-gray-300 rounded-full">
                    <Button
                      onClick={() => handleUpdateQuantity(item.id, "decrease")}
                      variant="ghost"
                      className="rounded-l-full px-3 py-1 hover:bg-gray-100"
                    >
                      <Minus size={20} />
                    </Button>
                    <span className="px-4 py-1 text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      onClick={() => handleUpdateQuantity(item.id, "increase")}
                      variant="ghost"
                      className="rounded-r-full px-3 py-1 hover:bg-gray-100"
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                  <Button
                    onClick={() => handleDeleteItem(item.id)}
                    variant="outline"
                    className="text-red-500 border-red-500 hover:bg-red-50 transition rounded-full p-2"
                  >
                    <Trash2 size={20} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="bg-gray-50 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold text-gray-700">Total:</span>
              <span className="text-2xl font-bold text-blue-600">{formatRupiah(totalPrice)}</span>
            </div>
            <Button
              onClick={() => router.push("/checkouts")}
              className="w-full py-4 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              Lanjutkan ke Pembayaran
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

