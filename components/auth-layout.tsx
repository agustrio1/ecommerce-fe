import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">{title}</h2>
          {children}
        </div>
      </motion.div>
    </div>
  )
}

