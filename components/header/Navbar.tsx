import * as React from "react";
import { ShoppingBag, Heart, Bell, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseJwt } from "@/utils/parseJwt";
import { getToken, clearToken } from "@/utils/token";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavbarStore } from "@/stores/useNavbarStore";
import useCategories from "@/hooks/useCategory";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [role, setRole] = React.useState<string | null>(null);
  const isMenuOpen = useNavbarStore((state) => state.isOpen);
  const toggleMenu = useNavbarStore((state) => state.toggleMenu);
  const categories = useNavbarStore((state) => state.categories);

  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState("");

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


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Searching: ${searchTerm}`);
    // router.push(`/search?query=${searchTerm}`); // Uncomment to redirect
  };

  return (
    <nav className="container fixed mx-auto flex h-[68px] w-full max-w-[1300px] items-center justify-between bg-transparent px-4 py-[18px] md:px-4 lg:justify-start lg:px-0">
      <div className="flex items-center justify-between w-full">
        <Link href="/" className="text-2xl font-bold lg:ml-8" aria-label="Home">
          BrandLogo
        </Link>

        {/* Product Search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center">
          <Input
            type="text"
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-2 border-gray-300 rounded-lg p-2 focus:outline-none focus:ring focus:ring-blue-500 transition duration-200"
          />
          <Button
            type="submit"
            className="ml-2 bg-blue-500 text-white rounded-lg p-2 transition duration-200 hover:bg-blue-600">
            Cari
          </Button>
        </form>

        {/* User Menu */}
        <div className="hidden md:flex space-x-4">
          <NavMenu
            categories={categories}
            isLoggedIn={isLoggedIn}
            role={role}
            onLogout={handleLogout}
            onLinkClick={handleLinkClick}
            mobile={undefined}
          />
        </div>

        <div className="flex items-center space-x-4 ml-12">
          <Link href="/wishlists" aria-label="Wishlist">
            <Heart className="text-2xl" />
          </Link>
          <Link href="/carts" aria-label="Shopping Cart">
            <ShoppingBag className="text-2xl" />
          </Link>
          <Link href="/notifications" aria-label="Notifikasi">
            <Bell className="text-2xl" />
          </Link>

          <button
            className="flex items-center gap-4 lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu">
            {/* Hamburger Menu for Mobile */}
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
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-0 z-50 bg-gray-100 text-black transition-transform transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } duration-300 z-20`}
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
          className="fixed inset-0 bg-black opacity-50 z-10 cursor-pointer"
          onClick={toggleMenu}
          aria-label="Close Menu"
        />
      )}
    </nav>
  );
};

// Reusable NavMenu component
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
      {/* Dropdown for Categories */}
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
            <ul
              className={`grid grid-cols-1 lg:grid-cols-2 xl::grid-cols-3 gap-2`}>
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
          {role === "ADMIN" && (
            <NavLink
              href="/dashboard"
              onClick={() => onLinkClick("/dashboard")}
              label="Dashboard Admin"
              mobile
              aria-label="Dashboard Admin"
            />
          )}
          {role === "USER" && (
            <NavLink
              href="/user"
              onClick={() => onLinkClick("/user")}
              label="User Page"
              mobile
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
