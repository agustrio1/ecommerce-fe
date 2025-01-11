import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cara Belanja - Agus Store',
  description: 'Pelajari cara berbelanja di Agus Store dengan mudah dan aman.',
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
