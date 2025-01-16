'use client';
import * as React from "react";
import Link from "next/link";
import { Menu, ShoppingBag, Search, Home, Heart, Bell, User, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { NavMenu } from "./NavMenu";
import { SearchResults } from "./SearchResults";
import { useNavbarStore } from "@/stores/useNavbarStore";

export const MobileNav = ({ categories, isLoggedIn, role, onLogout, onLinkClick }: any) => {
  const {
    searchTerm,
    results,
    isLoading,
    currentPage,
    totalPages,
    showResults,
    setShowResults,
    handleInputChange,
    handleSearch,
    handlePageChange,
    handleProductClick,
    formatRupiah,
  } = useSearch();

  const isMenuOpen = useNavbarStore((state) => state.isOpen);
  const toggleMenu = useNavbarStore((state) => state.toggleMenu);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<string>("");

  const getSliderPosition = (tab: string) => {
    switch (tab) {
      case "home":
        return "translate-x-0";
      case "search":
        return "translate-x-full";
      case "wishlist":
        return "translate-x-[200%]";
      case "notifications":
        return "translate-x-[300%]";
      case "profile":
        return "translate-x-[400%]";
      default:
        return "translate-x-0";
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-primary transition-colors"
            aria-label="Toggle Menu">
            <Menu className="w-6 h-6" />
          </button>
          <Link
            href="/"
            className="text-xl font-bold text-primary"
            aria-label="Home">
            Agus Store
          </Link>
          <Link
            href="/carts"
            className="text-gray-600 hover:text-primary transition-colors"
            aria-label="Shopping Cart">
            <ShoppingBag className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {showMobileSearch && (
        <div className="fixed inset-x-0 top-16 z-50 p-4 bg-white shadow-lg md:hidden mobile-search-container">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full pr-10 pl-10 py-2 border-none bg-gray-100 focus:ring-2 focus:ring-primary/50 rounded-full"
              autoFocus
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => {
                setShowMobileSearch(false);
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              aria-label="Close Search"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
          <SearchResults
            showResults={showResults}
            isLoading={isLoading}
            results={results}
            currentPage={currentPage}
            totalPages={totalPages}
            handleProductClick={handleProductClick}
            handlePageChange={handlePageChange}
            formatRupiah={formatRupiah}
          />
        </div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex justify-between items-center">
            <Link
              href="/"
              className="text-xl font-bold text-primary"
              aria-label="Home">
              Agus Store
            </Link>
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <NavMenu
              categories={categories}
              isLoggedIn={isLoggedIn}
              role={role}
              onLogout={onLogout}
              onLinkClick={onLinkClick}
              mobile
            />
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleMenu}
          aria-label="Close Menu"
        />
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
        <div className="grid grid-cols-5 gap-1 relative p-1">
          <div
            className={`absolute top-1 bottom-1 w-1/5 bg-primary/10 backdrop-blur-sm 
            rounded-2xl shadow-sm transform transition-all duration-500 ease-out
            ${getSliderPosition(activeTab)}`}
          />
          <BottomNavItem
            href="/"
            icon={Home}
            label="Beranda"
            isActive={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          />
          <BottomNavItem
            icon={Search}
            label="Cari"
            isActive={activeTab === "search"}
            onClick={() => {
              setActiveTab("search");
              setShowMobileSearch(true);
            }}
          />
          <BottomNavItem
            href="/wishlists"
            icon={Heart}
            label="Wishlist"
            isActive={activeTab === "wishlist"}
            onClick={() => setActiveTab("wishlist")}
          />
          <BottomNavItem
            href="/notifications"
            icon={Bell}
            label="Notifikasi"
            isActive={activeTab === "notifications"}
            onClick={() => setActiveTab("notifications")}
          />
          <BottomNavItem
            href={
              isLoggedIn
                ? role === "ADMIN"
                  ? "/dashboard"
                  : "/user"
                : "/login"
            }
            icon={User}
            label="Profil"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </div>
      </div>
    </>
  );
};

const BottomNavItem = ({ href, icon: Icon, label, isActive, onClick }: any) => (
  <Link
    href={href || "#"}
    onClick={onClick}
    className={`group flex flex-col items-center py-2 relative z-10 
    transition-all duration-300 rounded-2xl
    ${isActive ? "text-primary" : "text-gray-600"}
    hover:text-primary`}>
    <Icon
      className={`w-6 h-6 transition-all duration-300 ${
        isActive ? "scale-110" : "scale-100"
      } group-hover:scale-110`}
    />
    <span
      className={`text-xs mt-1 transition-all duration-300 ${
        isActive ? "font-medium" : "font-normal"
      } group-hover:font-medium`}>
      {label}
    </span>
  </Link>
);

