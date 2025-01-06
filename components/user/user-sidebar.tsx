"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  User, MapPin, ShoppingBag, Truck, LayoutDashboard, 
  Settings, HelpCircle, LogOut 
} from 'lucide-react'

const menuItems = [
  { name: "Dasbor", icon: LayoutDashboard, href: "/user" },
  { name: "Profil", icon: User, href: "/user/profile" },
  { name: "Alamat", icon: MapPin, href: "/user/addresses" },
  { name: "Riwayat Pesanan", icon: ShoppingBag, href: "/user/orders-history" },
  { name: "Status Pengiriman", icon: Truck, href: "/user/shipping" },
  { name: "Pengaturan", icon: Settings, href: "/user/settings" },
  { name: "Bantuan", icon: HelpCircle, href: "/user/help" },
  { name: "Kembali", icon: LogOut, href: "/" },
]

export default function UserSidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <aside
        className={`bg-white w-64 min-h-screen p-4 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static z-30`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="text-2xl font-bold text-primary">Menu Pengguna</h2>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                pathname.startsWith(item.href)
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
      <button
        className={`fixed bottom-4 right-4 md:hidden bg-primary text-white p-2 rounded-full shadow-lg z-40 transition-all ${
          isOpen ? "rotate-45" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup Menu" : "Buka Menu"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </>
  )
}
