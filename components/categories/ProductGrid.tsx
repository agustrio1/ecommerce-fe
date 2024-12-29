"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

interface Product {
  id: string;
  slug: StaticRange;
  name: string;
  price: number;
  images: { image: string }[];
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
      
        <motion.article
          key={product.id}
          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}>
            <Link href={`/products/${product.slug}`} key={product.id}>
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images[0]?.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>
            <p className="mt-2 text-xl font-bold text-blue-600">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price)}
            </p>
          </div>
          </Link>
        </motion.article>
      ))}
    </div>
  );
}
