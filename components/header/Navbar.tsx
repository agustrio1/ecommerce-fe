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

  // Handle click outside search
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

  const getSliderPosition = (tab : any) => {
    switch (tab) {
      case 'home': return 'translate-x-0';
      case 'search': return 'translate-x-full';
      case 'wishlist': return 'translate-x-[200%]';
      case 'notifications': return 'translate-x-[300%]';
      case 'profile': return 'translate-x-[400%]';
      default: return 'translate-x-0';
    }
  };

  return (
    <>
      {/* Desktop Navigation - Fixed at top */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50 hidden md:block">
        <div className="container mx-auto max-w-[1300px] px-4">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-2xl font-bold lg:ml-8"
              aria-label="Home">
              BrandLogo
            </Link>
            <form
              onSubmit={handleSearch}
              className="flex items-center flex-col mt-4 relative">
              <div className="flex items-center mb-4 w-full">
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={handleInputChange}
                  className="w-64"
                />
                <Button type="submit" className="ml-2">
                  Cari
                </Button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center mt-8">
                  <Loader2 className="animate-spin text-gray-600" />
                </div>
              ) : results.length === 0 && searchTerm.trim() ? (
                <p className="text-center my-4 mt-8">Tidak ada produk yang cocok.</p>
              ) : (
                <ul className="absolute top-full left-0 w-full mt-2 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-10">
                  {results.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center space-x-4 p-2 border-b">
                        <Link href={`/products/${product.slug}`} className="block p-2">
                      <img
                        src={
                          product.images.length > 0
                            ? product.images[0].image
                            : ""
                        }
                        alt={product.name}
                        className="w-16 h-16 object-cover"
                      />
                      <div className="flex flex-col">
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-gray-600">
                          {formatRupiah(product.price)}
                        </p>
                      </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>
            <div className="flex items-center space-x-6">
              <NavMenu
                categories={categories}
                isLoggedIn={isLoggedIn}
                role={role}
                onLogout={handleLogout}
                onLinkClick={handleLinkClick}
              />
              <div className="flex items-center space-x-4">
                <Link href="/wishlists" aria-label="Wishlist">
                  <Heart className="w-6 h-6" />
                </Link>
                <Link href="/carts" aria-label="Shopping Cart">
                  <ShoppingBag className="w-6 h-6" />
                </Link>
                <Link href="/notifications" aria-label="Notifikasi">
                  <Bell className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header - Simplified */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow z-50 md:hidden">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={toggleMenu}
            className="flex items-center"
            aria-label="Toggle Menu">
            <div className="space-y-1.5">
              <span
                className={`block w-6 h-0.5 bg-gray-950 transition-transform duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}></span>
              <span
                className={`block w-6 h-0.5 bg-gray-950 transition-opacity duration-300 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}></span>
              <span
                className={`block w-6 h-0.5 bg-gray-950 transition-transform duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}></span>
            </div>
          </button>
          <Link href="/" className="text-xl font-bold" aria-label="Home">
            BrandLogo
          </Link>
          <Link href="/carts" aria-label="Shopping Cart">
            <ShoppingBag className="w-6 h-6" />
          </Link>
        </div>
      </div>

      {/* Mobile Floating Search */}
      {showMobileSearch && (
        <div className="fixed inset-x-0 top-16 z-50 p-4 bg-white shadow-lg md:hidden mobile-search-container">
          <form onSubmit={(e) => e.preventDefault()} className="relative">
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={handleInputChange}
              className="w-full pr-10"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowMobileSearch(false)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              aria-label="Close Search">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </form>
          {isLoading ? (
            <p className="text-center animate-spin my-4 ">Loading...</p>
          ) : results.length === 0 && searchTerm.trim() ? (
            <p className="text-center">Tidak ada produk yang cocok.</p>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link href={`/products/${product.slug}`} className="block p-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={
                        product.images.length > 0 ? product.images[0].image : ""
                      }
                      alt={product.name}
                      className="w-16 h-16 object-cover"
                    />
                    <div className="flex flex-col">
                      <h3>{product.name}</h3>
                      <p>{formatRupiah(product.price)}</p>
                    </div>
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
        className={`fixed inset-0 z-50 bg-gray-100 text-black transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } duration-300 md:hidden`}
        style={{ width: "75%" }}>
        <div className="flex flex-col p-4 space-y-2">
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

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden cursor-pointer"
          onClick={toggleMenu}
          aria-label="Close Menu"
        />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-50">
      <div className="grid grid-cols-5 gap-1 relative p-1">
        <div 
          className={`absolute top-1 bottom-1 w-1/5 bg-blue-100/80 backdrop-blur-sm 
          rounded-2xl shadow-sm transform transition-transform duration-500 ease-out
          ${getSliderPosition(activeTab)}`}
        />
        <Link 
          href="/"
          onClick={() => setActiveTab('home')}
          className={`group flex flex-col items-center py-2 relative z-10 
          transition-all duration-300 rounded-2xl
          ${activeTab === 'home' ? 'text-blue-600 scale-105' : 'text-gray-600'}
          hover:text-blue-500`}
        >
          <Home className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs mt-1 transition-all duration-300 group-hover:font-medium">Beranda</span>
        </Link>

        <button
          onClick={() => {
            setActiveTab('search');
            setShowMobileSearch(true);
          }}
          className={`group flex flex-col items-center py-2 relative z-10 
          transition-all duration-300 rounded-2xl
          ${activeTab === 'search' ? 'text-gray-600 scale-105' : 'text-gray-600'}
          hover:text-blue-500`}
        >
          <Search className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs mt-1 transition-all duration-300 group-hover:font-medium">Cari</span>
        </button>

        <Link
          href="/wishlists"
          onClick={() => setActiveTab('wishlist')}
          className={`group flex flex-col items-center py-2 relative z-10 
          transition-all duration-300 rounded-2xl
          ${activeTab === 'wishlist' ? 'text-blue-600 scale-105' : 'text-gray-600'}
          hover:text-blue-500`}
        >
          <Heart className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs mt-1 transition-all duration-300 group-hover:font-medium">Wishlist</span>
        </Link>

        <Link
          href="/notifications"
          onClick={() => setActiveTab('notifications')}
          className={`group flex flex-col items-center py-2 relative z-10 
          transition-all duration-300 rounded-2xl
          ${activeTab === 'notifications' ? 'text-blue-600 scale-105' : 'text-gray-600'}
          hover:text-blue-500`}
        >
          <Bell className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs mt-1 transition-all duration-300 group-hover:font-medium">Notifikasi</span>
        </Link>

        <Link
          href={isLoggedIn ? (role === "ADMIN" ? "/dashboard" : "/user") : "/login"}
          onClick={() => setActiveTab('profile')}
          className={`group flex flex-col items-center py-2 relative z-10 
          transition-all duration-300 rounded-2xl
          ${activeTab === 'profile' ? 'text-blue-600 scale-105' : 'text-gray-600'}
          hover:text-blue-500`}
        >
          <User className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs mt-1 transition-all duration-300 group-hover:font-medium">Profil</span>
        </Link>
      </div>
    </div>
    </>
  );
};

// NavMenu component with removed search and dashboard/user links for mobile
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
    <>
      <div className="relative category-menu">
        <button
          onClick={toggleCategoryMenu}
          className="flex items-center mt-2 text-lg"
          aria-label="Categories">
          Kategori <ChevronDown className="ml-1" />
        </button>
        {isCategoryOpen && (
          <div
            className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 lg:w-96"
            onMouseLeave={() => setIsCategoryOpen(false)}>
            <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link
                    href={`/categories/${category.slug as string}`}
                    className="block px-4 py-2 text-lg font-medium hover:bg-gray-100 rounded transition duration-150"
                    aria-label="Categories">
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
      />
      <NavLink
        href="/about"
        onClick={() => onLinkClick("/about")}
        label="Tentang"
      />
      {isLoggedIn ? (
        <>
          {!mobile && role === "ADMIN" && (
            <NavLink
              href="/dashboard"
              onClick={() => onLinkClick("/dashboard")}
              label="Dashboard Admin"
              aria-label="Dashboard Admin"
            />
          )}
          {!mobile && role === "USER" && (
            <NavLink
              href="/user"
              onClick={() => onLinkClick("/user")}
              label="User Page"
              aria-label="User Page"
            />
          )}
          <button
            onClick={onLogout}
            className="block px-4 py-2 text-left hover:bg-gray-100">
            Logout
          </button>
        </>
      ) : (
        <>
          <NavLink
            href="/login"
            onClick={() => onLinkClick("/login")}
            label="Login"
            mobile
          />
          <NavLink
            href="/register"
            onClick={() => onLinkClick("/register")}
            label="Register"
            mobile
          />
        </>
      )}
    </>
  );
};

const NavLink = ({ href, onClick, label, mobile, showArrow }: any) => (
  <Link
    href={href}
    onClick={onClick}
    className={`block px-4 py-2 text-left hover:bg-gray-100 ${
      mobile ? "text-lg" : ""
    }`}>
    {label} {showArrow && <ChevronDown className="inline ml-1" />}
  </Link>
);

export default Navbar;
