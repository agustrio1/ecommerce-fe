'use client';

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Star, ShoppingBag, ArrowRight, ChevronRight } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function HeroBanner() {
  return (
    <div className="relative min-h-[600px] md:min-h-[700px] rounded-3xl overflow-hidden mb-12 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.8) 2px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
        animate={{
          backgroundPosition: ['0px 0px', '40px 40px'],
        }}
        transition={{
          duration: 10,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="text-white z-10 md:w-1/2 space-y-8 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4"
          >
            <span className="text-sm font-medium">🎉 Promo Spesial Hari Ini</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Temukan Produk <span className="text-yellow-300">Terbaik</span> untuk Gaya Hidupmu
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-white/80 max-w-xl"
          >
            Jelajahi koleksi produk premium kami dengan harga terbaik dan kualitas terjamin
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
             <Link href="/products">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-yellow-300 hover:text-blue-700 transition-colors">
                Mulai Belanja
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              Pelajari Lebih Lanjut
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-8 justify-center md:justify-start mt-8 pt-8 border-t border-white/20"
          >
            {[
              { value: "50K+", label: "Produk" },
              { value: "100K+", label: "Pelanggan" },
              { value: "4.9", label: "Rating" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-white/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative w-full md:w-1/2 h-[300px] md:h-[500px] mt-12 md:mt-0"
        >
          <div className="absolute inset-0">
            <Image
              src="/hero-banner.jpg"
              alt="Hero Product"
              fill
              className="object-cover rounded-2xl shadow-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -left-4 top-1/4 bg-white p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <Star className="text-yellow-400 h-5 w-5 fill-current" />
                <span className="font-bold">4.9</span>
                <span className="text-gray-500">(2.5k review)</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -right-4 bottom-1/4 bg-white p-4 rounded-xl shadow-lg"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-blue-600 h-5 w-5" />
                <span className="font-bold text-green-600">Diskon 45%</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default HeroBanner;