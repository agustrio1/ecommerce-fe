'use client'

import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowToOrder() {
  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="bg-green-600 p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Cara Belanja di Agus Store
          </h1>
          <p className="text-green-100 text-xl">
            Panduan Lengkap untuk Pengalaman Belanja Terbaik
          </p>
        </div>
        <div className="p-8 sm:p-12">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Belanja di Agus Store mudah dan cepat. Ikuti langkah-langkah berikut 
            untuk memesan produk yang Anda inginkan:
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-12 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-md"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800">Penting!</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Sebelum memulai proses belanja, pastikan Anda sudah memiliki akun di 
                    Agus Store. Dengan memiliki akun, Anda dapat melacak pesanan, menyimpan 
                    riwayat belanja, dan menikmati pengalaman belanja yang lebih nyaman.
                  </p>
                  <p className="mt-2">
                    Jika belum memiliki akun, silakan <strong>daftar</strong> terlebih dahulu 
                    di halaman registrasi kami.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Langkah-langkah Pemesanan</h2>
          <ol className="space-y-8">
            {steps.map((step, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                className="flex items-start"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="ml-4">
                  <p className="text-lg text-gray-700">{step}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Jika Anda mengalami kesulitan dalam proses pemesanan, hubungi 
              tim layanan pelanggan kami. Kami siap membantu!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

const steps = [
  "Pilih produk yang Anda inginkan di halaman produk atau detail produk.",
  "Klik tombol \"Tambah ke Keranjang\". Jika produk tinggal satu dan ada di keranjang pengguna lain, Anda akan diberi notifikasi bahwa produk tidak dapat ditambahkan.",
  "Buka halaman Keranjang untuk melihat daftar produk yang akan Anda beli.",
  "Klik \"Checkout\" dan masukkan alamat pengiriman baru.",
  "Pilih layanan pengiriman yang tersedia (contoh: JNE, TIKI, dll.).",
  "Pilih metode pembayaran melalui Midtrans (Virtual Account atau Transfer Bank).",
  "Selesaikan pembayaran sesuai instruksi, dan Anda akan menerima konfirmasi melalui email."
]
