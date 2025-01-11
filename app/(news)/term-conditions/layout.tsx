import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat dan Ketentuan - Agus Store',
  description: 'Baca syarat dan ketentuan penggunaan layanan kami di Agus Store.',
}

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {children}
    </div>
  )
}
