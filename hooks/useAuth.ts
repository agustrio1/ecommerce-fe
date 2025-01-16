'use client'

import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { parseJwt } from "@/utils/parseJwt";
import { getToken, clearToken } from "@/utils/token";

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
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

  return { isLoggedIn, role, handleLogout };
}

