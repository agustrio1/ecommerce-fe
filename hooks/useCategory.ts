'use client'

import { useEffect } from "react";
import { useNavbarStore } from "@/stores/useNavbarStore";

const useCategories = () => {
  const setCategories = useNavbarStore((state) => state.setCategories);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
        });

        if (!res.ok) {
          console.error("Failed to fetch categories");
          return;
        }

        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("An error occurred while fetching categories:", error);
      }
    };

    fetchCategories();
  }, [setCategories]);
};

export default useCategories;
