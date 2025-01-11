'use client'

import { Shield, UserPlus, Key, CreditCard, Package, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TermsAndConditions() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden"
      >
        <div className="bg-blue-600 p-8 sm:p-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">
            Syarat dan Ketentuan
          </h1>
          <p className="text-blue-100 text-xl">
            Agus Store - Pengalaman Belanja Terbaik
          </p>
        </div>
        <div className="p-8 sm:p-12">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 mb-8 text-lg"
          >
            Selamat datang di Agus Store! Dengan menggunakan layanan kami, Anda menyetujui syarat dan ketentuan berikut. Harap baca dengan saksama untuk pengalaman belanja yang nyaman dan aman.
          </motion.p>
          <TermsAndConditionsContent />
        </div>
      </motion.div>
    </div>
  )
}

function TermsAndConditionsContent() {
  const sections = [
    {
      icon: <UserPlus className="w-10 h-10 text-blue-500" />,
      title: 'Registrasi Akun',
      content: (
        <>
          <p>Untuk memulai belanja di Agus Store, Anda perlu mendaftar untuk akun yang memungkinkan Anda untuk:</p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>Melakukan pelacakan pesanan.</li>
            <li>Menyimpan riwayat belanja.</li>
            <li>Memperoleh akses ke penawaran eksklusif dan promosi.</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Key className="w-10 h-10 text-blue-500" />,
      title: 'Lupa Password',
      content: (
        <p>
          Jika Anda lupa password, Anda dapat mengatur ulangnya dengan mengikuti langkah-langkah berikut:
          <ol className="list-decimal list-inside text-gray-600 mt-4 space-y-2">
            <li>Klik tombol "Lupa Password" pada halaman login.</li>
            <li>Masukkan email untuk menerima link reset password yang berlaku selama 1 jam.</li>
            <li>Masukkan password baru Anda dan login kembali.</li>
          </ol>
        </p>
      ),
    },
    {
      icon: <CreditCard className="w-10 h-10 text-blue-500" />,
      title: 'Metode Pembayaran',
      content: (
        <>
          <p>Pembayaran dapat dilakukan melalui beberapa metode yang tersedia, termasuk:</p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>Virtual Account dari berbagai bank.</li>
            <li>Transfer Bank langsung.</li>
            <li>Metode lain melalui Midtrans.</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Package className="w-10 h-10 text-blue-500" />,
      title: 'Ketersediaan Stok',
      content: (
        <p>
          Harap diperhatikan bahwa jika stok produk terbatas (misalnya hanya 1 unit tersisa), produk tersebut 
          tidak dapat ditambahkan ke keranjang jika sudah ada pengguna lain yang memasukkan produk tersebut ke 
          keranjang mereka. Segera selesaikan checkout untuk menghindari kehilangan produk.
        </p>
      ),
    },
    {
      icon: <Truck className="w-10 h-10 text-blue-500" />,
      title: 'Pengiriman',
      content: (
        <p>
          Kami menyediakan berbagai pilihan pengiriman untuk memudahkan Anda. Pengiriman dilakukan setelah pembayaran
          diterima dan produk dikemas dengan aman. Waktu pengiriman dapat bervariasi tergantung lokasi dan metode
          pengiriman yang dipilih.
        </p>
      ),
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-500" />,
      title: 'Keamanan Akun dan Data',
      content: (
        <>
          <p>
            Keamanan data pribadi Anda sangat penting bagi kami. Kami berkomitmen untuk menjaga informasi akun Anda dengan
            baik. Pastikan Anda tidak membagikan data login Anda kepada orang lain.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>Gunakan password yang kuat dan tidak mudah ditebak.</li>
            <li>Jaga kerahasiaan email dan password Anda.</li>
            <li>Segera hubungi kami jika ada aktivitas yang mencurigakan pada akun Anda.</li>
          </ul>
        </>
      ),
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-500" />,
      title: 'Kebijakan Pengembalian Barang',
      content: (
        <>
          <p>
            Jika produk yang Anda terima tidak sesuai dengan pesanan atau rusak, Anda dapat mengajukan pengembalian
            barang dalam jangka waktu 7 hari setelah menerima pesanan. Pastikan barang dalam kondisi yang belum terpakai
            dan dikemas kembali dengan baik.
          </p>
          <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
            <li>Pengembalian hanya berlaku untuk produk yang rusak atau salah kirim.</li>
            <li>Proses pengembalian uang akan dilakukan dalam 7-10 hari kerja.</li>
          </ul>
        </>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      {sections.map((section, index) => (
        <Section
          key={index}
          icon={section.icon}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  )
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex space-x-6"
    >
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="text-gray-600">{content}</div>
      </div>
    </motion.div>
  )
}
