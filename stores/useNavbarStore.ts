import { create } from "zustand";

interface NavbarState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
  incrementCartItemCount: () => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  isOpen: false,
  categories: [],
  cartItemCount: 0,
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMenu: () => set({ isOpen: false }),
  setCategories: (categories) => set({ categories }),
  setCartItemCount: (count) => set({ cartItemCount: count }),
  incrementCartItemCount: () => set((state) => ({ cartItemCount: state.cartItemCount + 1 })),
}));

