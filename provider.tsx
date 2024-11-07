'use client'

import * as React from "react"
import {usePathname} from "next/navigation"
import Navbar from "./components/header/Navbar"

type Props = {
    children: React.ReactNode;
  };
  
  const Provider = ({ children }: Props) => {  
    const pathname = usePathname();
    const disableNavbar = ["login", "register", "forgot-password", "reset-password", "dashboard", "user"];
   
    return (
      <>
         {!disableNavbar.includes(pathname.split("/")[1]) && <Navbar />}
        {children}
      </>
    );
  };

  export default Provider;