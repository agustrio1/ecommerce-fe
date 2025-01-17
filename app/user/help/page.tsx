"use client";

import { ShoppingCart, AlertCircle, CheckCircle, Info, RotateCw, PhoneCall, ShieldCheck, ChevronDown } from 'lucide-react';
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

export default function Help() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen py-4 px-0 md:px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-blue-600 p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Pusat Bantuan Agus Store
          </h1>
          <p className="text-blue-100 text-xl">
            Temukan semua panduan, tips, dan bantuan teknis untuk pengalaman
            belanja Anda.
          </p>
        </div>

        {/* Content */}
        <div className="p-8 sm:p-12">
          {/* Introduction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Selamat datang di Pusat Bantuan Agus Store! Kami telah menyiapkan
            panduan lengkap untuk memastikan pengalaman belanja Anda lebih
            mudah, aman, dan nyaman.
          </motion.p>

          {/* Important Notice */}
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
                <h3 className="text-lg font-medium text-yellow-800">
                  Perhatian!
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    Pastikan Anda memeriksa informasi berikut sebelum melakukan
                    transaksi untuk menghindari kesalahan dan memastikan
                    transaksi Anda berjalan lancar.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sections */}
          <Accordion type="single" collapsible className="space-y-6">
            <AccordionSection
              title="Cara Berbelanja"
              icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
              content={[
                "Cari produk yang Anda inginkan dengan menggunakan fitur pencarian atau kategori.",
                "Gunakan filter untuk mempersempit hasil pencarian berdasarkan harga, ulasan, dan lainnya.",
                'Klik "Tambah ke Keranjang" untuk menyimpan produk dalam daftar belanja Anda.',
                "Lihat detail produk seperti ulasan pelanggan, stok, dan spesifikasi sebelum membeli.",
                "Buka halaman Keranjang untuk memeriksa daftar belanja Anda.",
                'Klik "Checkout" untuk memasukkan informasi pengiriman dan memilih metode pembayaran.',
                "Pastikan semua detail sudah benar sebelum mengkonfirmasi pesanan.",
              ]}
            />

            <AccordionSection
              title="FAQ (Pertanyaan Umum)"
              icon={<Info className="h-6 w-6 text-purple-500" />}
              content={[
                'Bagaimana cara membuat akun? - Klik "Daftar" di halaman utama dan lengkapi form yang tersedia.',
                'Bagaimana cara mengubah password? - Buka halaman profil Anda, lalu pilih "Ubah Password".',
                "Apakah bisa membatalkan pesanan? - Ya, Anda bisa menghungi nomor admin untuk membatalkan pesanan, dengan syarat pesanan belum dikirim.",
                "Bagaimana cara menambahkan alamat baru? - Tambahkan alamat baru di pengaturan akun Anda, dan di halaman checkout.",
                "Apa yang harus dilakukan jika produk rusak? - Hubungi layanan pelanggan untuk pengembalian atau penggantian.",
                'Bagaimana saya bisa melacak pengiriman? - Nomor resi akan diberikan apabila pembayaran sudah dilakukan dan berhasil, serta pesanan sudah dikirim.',
                "Apakah semua produk memiliki garansi? - Cek halaman produk untuk informasi garansi.",
                'Bagaimana cara mendapatkan promo? - Ikuti akun sosial media kami atau kunjungi halaman "Promo".',
                "Apa saja metode pembayaran yang tersedia? - Virtual Account, transfer bank, dompet digital, dan kartu kredit.",
                "Bagaimana cara menghubungi customer service? - Gunakan fitur live chat atau kirim email ke cs@agusstore.com.",
              ]}
            />

            <AccordionSection
              title="Kebijakan Pengembalian Barang"
              icon={<RotateCw className="h-6 w-6 text-red-500" />}
              content={[
                "Pengembalian barang hanya berlaku untuk produk yang memenuhi syarat garansi.",
                'Ajukan pengembalian melalui halaman "Status Pesanan" dalam waktu 7 hari setelah barang diterima.',
                "Produk harus dikembalikan dalam kondisi asli, lengkap dengan kemasan dan label.",
                "Biaya pengembalian barang ditanggung oleh pelanggan, kecuali barang rusak akibat kesalahan penjual.",
              ]}
            />

            <AccordionSection
              title="Layanan Pelanggan"
              icon={<PhoneCall className="h-6 w-6 text-green-500" />}
              content={[
                "Layanan pelanggan tersedia setiap hari dari pukul 08:00 hingga 22:00 WIB.",
                "Hubungi kami melalui fitur live chat untuk respon cepat.",
                "Email kami di cs@agusstore.com untuk pertanyaan yang lebih mendetail.",
                "Layanan telepon dapat diakses melalui nomor 0800-123-4567.",
              ]}
            />

            <AccordionSection
              title="Tips Keamanan Belanja"
              icon={<ShieldCheck className="h-6 w-6 text-blue-600" />}
              content={[
                "Gunakan kata sandi yang kuat dan unik untuk akun Anda.",
                "Hindari berbagi informasi akun dengan orang lain.",
                "Periksa ulasan produk dan reputasi penjual sebelum membeli.",
                "Gunakan metode pembayaran yang aman seperti dompet digital atau transfer bank.",
                "Hindari mengklik tautan mencurigakan dari sumber yang tidak dikenal.",
              ]}
            />
          </Accordion>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <p className="text-sm text-gray-500 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Jika Anda membutuhkan bantuan lebih lanjut, tim layanan pelanggan
              kami siap membantu Anda 24/7!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// Reusable Accordion Section Component
function AccordionSection({ title, icon, content }: SectionProps) {
  return (
    <AccordionItem value={title}>
      <AccordionTrigger>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">{icon}</div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
}

