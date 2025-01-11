import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Home,
  ShoppingBag,
  MessageCircle,
  FileText,
  HelpCircle,
} from "lucide-react";

export const Footer = () => {
  // Dynamically get the year only on the client side
  const year = typeof window !== "undefined" ? new Date().getFullYear() : "2025";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Tentang Kami</h3>
            <p className="text-gray-400">
              Agus Store adalah toko online yang menjual berbagai produk
              berkualitas, termasuk produk elektronik, fashion, dan aksesoris.
              Kami berkomitmen untuk memberikan pengalaman belanja yang
              menyenangkan dan memuaskan.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors flex items-center"
                  >
                    {link.icon}
                    <span className="ml-2">{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Hubungi Kami</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                <span>+62 123 456 7890</span>
              </li>
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@agusstore.com</span>
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Jl. Contoh No. 123, Kota, Indonesia</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{link.name}</span>
                  {link.icon}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {year} Agus Store. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

const quickLinks = [
  { href: "/", text: "Beranda", icon: <Home className="h-4 w-4" /> },
  { href: "/products", text: "Produk", icon: <ShoppingBag className="h-4 w-4" /> },
  { href: "/kontak", text: "Hubungi Kami", icon: <MessageCircle className="h-4 w-4" /> },
  { href: "/term-conditions", text: "Syarat dan Ketentuan", icon: <FileText className="h-4 w-4" /> },
  { href: "/how-to-order", text: "Cara Belanja", icon: <HelpCircle className="h-4 w-4" /> },
];

const socialLinks = [
  { href: "#", name: "Facebook", icon: <Facebook className="h-6 w-6" /> },
  { href: "#", name: "Instagram", icon: <Instagram className="h-6 w-6" /> },
  { href: "#", name: "Twitter", icon: <Twitter className="h-6 w-6" /> },
];
