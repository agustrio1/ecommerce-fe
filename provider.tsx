'use client'

import * as React from "react"
import {usePathname} from "next/navigation"
import Navbar from "./components/header/Navbar"
import { Footer } from "./components/Footer/Footer"

type Props = {
    children: React.ReactNode;
};

const Provider = ({ children }: Props) => {
    const pathname = usePathname();
    const disableNavbar = ["login", "register", "forgot-password", "reset-password", "dashboard", "user"];
    const disableFooter = ["login", "register", "forgot-password", "reset-password", "dashboard", "user"];
   
    // Menentukan apakah navbar ditampilkan atau tidak
    const showNavbar = !disableNavbar.includes(pathname.split("/")[1]);
   
    return (
      <>
        {showNavbar && <Navbar />}
        <main className={showNavbar ? "pt-16" : ""}>
            {children}
        </main>
        {!disableFooter.includes(pathname.split("/")[1]) && <Footer />}
      </>
    );
};

export default Provider;
