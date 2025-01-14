import * as React from "react";
import {
  ShoppingBag,
  Heart,
  Bell,
  ChevronDown,
  Search,
  Home,
  User,
  X,
  Loader2,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/utils/parseJwt";
import { getToken, clearToken } from "@/utils/token";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/stores/useNavbarStore";
import useCategories from "@/hooks/useCategory";
import { formatRupiah } from "@/utils/currency";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);
  const [showMobileSearch, setShowMobileSearch] = React.useState(false);
  const isMenuOpen = useNavbarStore((state) => state.isOpen);
  const toggleMenu = useNavbarStore((state) => state.toggleMenu);
  const categories = useNavbarStore((state) => state.categories);
  const [activeTab, setActiveTab] = React.useState<string>("");
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [results, setResults] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useCategories();

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await getToken();
      if (token) {
        const decodedToken = parseJwt(token);
        if (decodedToken?.role) {
          setRole(decodedToken.role);
          setIsLoggedIn(true);
        }
      }
    };

    fetchToken();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    setIsLoggedIn(false);
    setRole(null);
    router.push("/login");
  };

  const handleLinkClick = (path: string) => {
    if (window.innerWidth <= 1024) {
      setTimeout(() => {
        toggleMenu();
        router.push(path);
      }, 150);
    } else {
      router.push(path);
    }
  };

  const fetchProducts = async (term: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products?search=${term}`
      );
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();
      if (data.length === 0) {
        setResults([]);
      } else {
        setResults(data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const res = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/${searchTerm}`
    );
    setShowMobileSearch(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".mobile-search-container")) {
        setShowMobileSearch(false);
      }
    };

    if (showMobileSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMobileSearch]);

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
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50 hidden md:block">
        <div className="container mx-auto max-w-7xl px-4">
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
              {/* Search Results */}
              {isLoading ? (
                <div className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md p-4 mt-2">
                  <Loader2 className="animate-spin mx-auto text-primary" />
                </div>
              ) : (
                results.length > 0 && (
                  <ul className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-md max-h-96 overflow-y-auto z-10 mt-2">
                    {results.map((product) => (
                      <li key={product.id} className="border-b last:border-b-0">
                        <Link
                          href={`/products/${product.slug}`}
                          className="flex items-center space-x-4 p-4 hover:bg-gray-50 transition duration-150">
                          <img
                            src={product.images[0]?.image || "/placeholder.png"}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold text-sm">
                              {product.name}
                            </h3>
                            <p className="text-primary font-medium">
                              {formatRupiah(product.price)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )
              )}
            </div>
            <div className="flex items-center space-x-6">
              <NavMenu
                categories={categories}
                isLoggedIn={isLoggedIn}
                role={role}
                onLogout={handleLogout}
                onLinkClick={handleLinkClick}
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

      {/* Mobile Header */}
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

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="fixed inset-x-0 top-16 z-50 p-4 bg-white shadow-lg md:hidden mobile-search-container">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
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
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              aria-label="Close Search">
              <X className="w-5 h-5" />
            </button>
          </form>
          {isLoading ? (
            <div className="flex justify-center items-center my-4">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : results.length === 0 && searchTerm.trim() ? (
            <p className="text-center text-gray-500 my-4">
              Tidak ada produk yang cocok.
            </p>
          ) : (
            <ul className="mt-4">
              {results.map((product) => (
                <li key={product.id} className="border-b last:border-b-0">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex items-center space-x-4 p-4">
                    <img
                      src={product.images[0]?.image || "/placeholder-card.svg"}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-primary">
                        {formatRupiah(product.price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Mobile Slide Menu */}
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
              onLogout={handleLogout}
              onLinkClick={handleLinkClick}
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

      {/* Mobile Bottom Navigation */}
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

const NavMenu = ({
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

export default Navbar;
