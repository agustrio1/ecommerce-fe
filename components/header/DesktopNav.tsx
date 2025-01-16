import Link from "next/link";
import { Search, Heart, ShoppingBag, Bell } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/hooks/useSearch";
import { NavMenu } from "./NavMenu";
import { SearchResults } from "./SearchResults";

export const DesktopNav = ({ categories, isLoggedIn, role, onLogout, onLinkClick }: any) => {
  const {
    searchTerm,
    results,
    isLoading,
    currentPage,
    totalPages,
    showResults,
    handleInputChange,
    handleSearch,
    handlePageChange,
    handleProductClick,
    formatRupiah,
  } = useSearch();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 hidden md:block">
      <div className="container mx-auto w-full px-4">
        <div className="flex items-center justify-between h-4">
          <Link
            href="/"
            className="flex items-center space-x-3 text-primary font-semibold hover:text-secondary transition-colors duration-300"
            aria-label="Home">
            <img
              src="https://res.cloudinary.com/dctg4e1q8/image/upload/v1736860192/tfjxxvfgmmbtqnuczbvf.webp"
              alt="Brand Logo"
              className="w-12 h-12 rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            />
            <span className="hidden sm:inline-block text-xl font-semibold">
              Agus Store
            </span>
          </Link>

          <div className="flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={handleInputChange}
                className="w-full pr-10 pl-10 py-2 border-none bg-gray-100 focus:ring-2 focus:ring-primary/50 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="absolute right-1 top-1/2 transform -translate-y-1/2">
                Cari
              </Button>
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
          <div className="flex items-center space-x-6">
            <NavMenu
              categories={categories}
              isLoggedIn={isLoggedIn}
              role={role}
              onLogout={onLogout}
              onLinkClick={onLinkClick}
            />
            <div className="flex items-center space-x-4">
              <IconLink href="/wishlists" icon={Heart} label="Wishlist" />
              <IconLink
                href="/carts"
                icon={ShoppingBag}
                label="Shopping Cart"
              />
              <IconLink
                href="/notifications"
                icon={Bell}
                label="Notifications"
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const IconLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => (
  <Link
    href={href}
    className="text-gray-600 hover:text-primary transition-colors"
    aria-label={label}>
    <Icon className="w-6 h-6" />
  </Link>
);
