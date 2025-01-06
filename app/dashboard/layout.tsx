"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useNavbarStore } from "@/stores/useNavbarStore";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isOpen, toggleMenu, closeMenu } = useNavbarStore();

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-lg">
        <div className="flex items-center justify-between p-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex items-center p-2 text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={toggleMenu}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-12 h-12 md:w-16 md:h-16"
                viewBox="0 0 64 64"
              >
                <circle cx="32" cy="32" r="30" fill="#4f46e5" />
                <text
                  x="32"
                  y="32"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill="#ffffff"
                  fontWeight="bold"
                >
                  Agus Store
                </text>
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`bg-gray-800 fixed inset-y-0 left-0 z-50 w-64 h-[100vh] transition-all duration-300 ease-in-out transform md:translate-x-0 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } md:relative md:w-64`}
        >
          <div className="flex flex-col h-full bg-gray-800 text-white p-6 space-y-4">
            <button
              type="button"
              className="self-end p-2 text-gray-400 hover:bg-gray-700 rounded-lg md:hidden"
              onClick={closeMenu}
            >
              <span className="sr-only">Close sidebar</span>
              <svg
                className="w-6 h-6"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            <div className="space-y-4">
              <Link
                href="/dashboard"
                className="block px-4 py-3 rounded-md text-lg font-medium text-gray-100 hover:bg-gray-700 transition duration-200"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/category"
                className="block px-4 py-3 rounded-md text-lg font-medium text-gray-100 hover:bg-gray-700 transition duration-200"
              >
                Kategori
              </Link>
              <Link
                href="/dashboard/product"
                className="block px-4 py-3 rounded-md text-lg font-medium text-gray-100 hover:bg-gray-700 transition duration-200"
              >
                Produk
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out mt-4 md:ml-16 md:mt-8 px-6 max-w-full sm:px-6 lg:px-8 ${
            isOpen ? "md:ml-64" : ""
          }`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
