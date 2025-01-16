'use client';

import * as React from 'react';
import Link from "next/link";
import { ChevronDown } from 'lucide-react';

export const NavMenu = ({
  categories,
  isLoggedIn,
  role,
  onLogout,
  onLinkClick,
  mobile,
}: any) => {
  const [isCategoryOpen, setIsCategoryOpen] = React.useState(false);

  const toggleCategoryMenu = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".category-menu")) {
      setIsCategoryOpen(false);
    }
  };

  React.useEffect(() => {
    if (isCategoryOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isCategoryOpen]);

  return (
    <div
      className={`${mobile ? "space-y-4 p-4" : "flex items-center space-x-4"}`}>
      <div className="relative category-menu">
        <button
          onClick={toggleCategoryMenu}
          className="flex items-center text-gray-700 hover:text-primary transition-colors"
          aria-label="Categories">
          Kategori <ChevronDown className="ml-1" />
        </button>
        {isCategoryOpen && (
          <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-64">
            <ul className="space-y-2">
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug as string}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary rounded transition duration-150"
                    onClick={() => {
                      onLinkClick(`/categories/${category.slug}`);
                      setIsCategoryOpen(false);
                    }}>
                    {category.name as string}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <NavLink
        href="/products"
        onClick={() => onLinkClick("/products")}
        label="Produk"
        mobile={mobile}
      />
      <NavLink
        href="/about"
        onClick={() => onLinkClick("/about")}
        label="Tentang"
        mobile={mobile}
      />
      {isLoggedIn ? (
        <>
          {!mobile && role === "ADMIN" && (
            <NavLink
              href="/dashboard"
              onClick={() => onLinkClick("/dashboard")}
              label="Dashboard Admin"
              mobile={mobile}
            />
          )}
          {!mobile && role === "USER" && (
            <NavLink
              href="/user"
              onClick={() => onLinkClick("/user")}
              label="User Page"
              mobile={mobile}
            />
          )}
          <button
            onClick={onLogout}
            className={`${
              mobile ? "block w-full text-left" : ""
            } px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary rounded transition duration-150`}>
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            href="/login"
            onClick={() => onLinkClick("/login")}
            label="Login"
            mobile={mobile}
          />
          <NavLink
            href="/register"
            onClick={() => onLinkClick("/register")}
            label="Register"
            mobile={mobile}
          />
        </>
      )}
    </div>
  );
};

const NavLink = ({ href, onClick, label, mobile }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className={`${
      mobile ? "block px-4 py-2 text-base" : "inline-block px-2 py-1 text-sm"
    } text-gray-700 hover:bg-gray-100 hover:text-primary rounded transition duration-150`}>
    {label}
  </Link>
);

