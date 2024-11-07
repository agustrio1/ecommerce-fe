import { create } from "zustand";

interface NavbarState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  categories: any[];
  setCategories: (categories: any[]) => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  isOpen: false,
  categories: [],
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
  closeMenu: () => set({ isOpen: false }),
  setCategories: (categories) => set({ categories }),
}));
