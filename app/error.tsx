'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="w-full h-64 mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 300"
            className="w-full h-full"
          >
            <rect width="400" height="300" fill="#f3f4f6" />
            <circle cx="200" cy="150" r="80" fill="#e5e7eb" />
            {/* Tubuh orang */}
            <path
              d="M180 190 L220 190 Q230 190 230 180 L230 120 Q230 110 220 110 L180 110 Q170 110 170 120 L170 180 Q170 190 180 190 Z"
              fill="#4b5563"
            />
            {/* Layar laptop */}
            <rect x="175" y="140" width="50" height="30" fill="#9ca3af" />
            {/* Basis laptop */}
            <path
              d="M165 170 L235 170 L245 190 L155 190 Z"
              fill="#6b7280"
            />
            {/* Kepala orang */}
            <circle cx="200" cy="90" r="20" fill="#4b5563" />
            {/* Tangan */}
            <path
              d="M170 130 Q150 150 160 180"
              fill="none"
              stroke="#4b5563"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M230 130 Q250 150 240 180"
              fill="none"
              stroke="#4b5563"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Simbol pemeliharaan */}
            <circle cx="260" cy="70" r="15" fill="none" stroke="#4b5563" strokeWidth="4" />
            <path
              d="M260 65 L260 75 M255 70 L265 70"
              stroke="#4b5563"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M140 60 L150 70 L140 80"
              fill="none"
              stroke="#4b5563"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Ups! Terjadi Kesalahan
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Kami mohon maaf, tetapi kami mengalami kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang berusaha untuk memperbaikinya.
        </p>
        <div className="mt-8 space-y-4">
          <Button onClick={() => reset()} className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" /> Coba Lagi
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href="/">
              <Home className="mr-2 h-4 w-4" /> Kembali ke Beranda
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
