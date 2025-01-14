"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useNavbarStore();

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                viewBox="0 0 64 64"
              >
                <circle cx="32" cy="32" r="30" fill="#4f46e5" />
                <text
                  x="32"
                  y="32"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="24"
                  fill="#ffffff"
                  fontWeight="bold"
                >
                  AS
                </text>
              </svg>
              <span className="text-xl font-semibold text-gray-800">Agus Store</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/dashboard/category", label: "Kategori" },
              { href: "/dashboard/product", label: "Produk" },
              { href: "/dashboard/orders", label: "Pesanan" },
              { href: "/dashboard/users", label: "Pengguna" },
              {href: "/dashboard/notifications", label: " Buat Notifikasi"},
              {href: "/dashboard/discount", label: "Diskon"},
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 hover:bg-gray-100 ${
                  pathname === item.href
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'lg:ml-64' : ''
      }`}>
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <button
                  onClick={toggleMenu}
                  className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                >
                  <span className="sr-only">Open sidebar</span>
                  <Menu size={24} />
                </button>
              </div>
              <div className="flex items-center">
                <button className="flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

