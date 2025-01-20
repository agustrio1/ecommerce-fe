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
  const { cartItems, loading, error, handleUpdateQuantity, handleDeleteItem } = useCart();
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
    <div className="container mx-auto px-4 py-12 pt-24 max-w-4xl">
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
          <p className="text-xl sm:text-2xl text-gray-600">
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
                className="bg-white shadow-lg rounded-2xl overflow-hidden transition hover:shadow-xl"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="w-full sm:w-1/3 relative aspect-square sm:aspect-auto">
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
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                        {item.product?.name}
                      </h3>
                      <div className="text-lg sm:text-xl font-bold text-blue-600 mb-4">
                        {formatRupiah(item.product?.price)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-full">
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "decrease")}
                          variant="ghost"
                          className="rounded-l-full px-3 py-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </Button>
                        <span className="px-4 py-1 text-lg font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          onClick={() => handleUpdateQuantity(item.id, "increase")}
                          variant="ghost"
                          className="rounded-r-full px-3 py-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
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
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-lg"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xl sm:text-2xl font-semibold text-gray-700">Total:</span>
              <span className="text-2xl sm:text-3xl font-bold text-blue-600">{formatRupiah(totalPrice)}</span>
            </div>
            <Button
              onClick={() => router.push("/checkouts")}
              className="w-full py-4 bg-blue-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              Lanjutkan ke Pembayaran
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

