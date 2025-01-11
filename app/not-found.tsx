import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 text-center">
                <div className="w-full h-64 mb-8 flex justify-center items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 400 400"
                        className="w-64 h-64 text-gray-500"
                    >
                        <text x="50%" y="50%" textAnchor="middle" dy="10" fontSize="120" fontWeight="bold" fill="#4b5563">
                            404
                        </text>
                        <circle cx="200" cy="200" r="160" fill="none" stroke="#4b5563" strokeWidth="12" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Ups! Halaman Tidak Ditemukan
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Halaman yang Anda cari tidak tersedia. Mungkin sudah dipindahkan, dihapus, atau Anda mungkin salah mengetik alamatnya.
                </p>
                <div className="mt-8 space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" /> Kembali ke Beranda
                        </Link>
                    </Button>
                    <Button variant="outline" asChild className="w-full">
                        <Link href="javascript:history.back()">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Halaman Sebelumnya
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
