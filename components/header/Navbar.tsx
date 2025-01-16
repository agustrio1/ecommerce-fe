'use client'
import React from 'react';
import { useRouter } from "next/navigation";
import { useNavbarStore } from "@/stores/useNavbarStore";
import useCategories from "@/hooks/useCategory";
import { useAuth } from "@/hooks/useAuth";
import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";

const Navbar = () => {
  const categories = useNavbarStore((state) => state.categories);
  const { isLoggedIn, role, handleLogout } = useAuth();
  const router = useRouter();
  
  useCategories();

  const handleLinkClick = (path: string) => {
    if (window.innerWidth <= 1024) {
      setTimeout(() => {
        useNavbarStore.getState().toggleMenu();
        router.push(path);
      }, 150);
    } else {
      router.push(path);
    }
  };

  return (
    <>
      <DesktopNav
        categories={categories}
        isLoggedIn={isLoggedIn}
        role={role}
        onLogout={handleLogout}
        onLinkClick={handleLinkClick}
      />
      <MobileNav
        categories={categories}
        isLoggedIn={isLoggedIn}
        role={role}
        onLogout={handleLogout}
        onLinkClick={handleLinkClick}
      />
    </>
  );
};

export default Navbar;

