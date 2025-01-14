import { ElementType } from "react";

export interface NavMenuProps {
  categories: any[];
  isLoggedIn: boolean;
  role: string | null;
  onLogout: () => void;
  onLinkClick: (path: string) => void;
  mobile?: boolean;
}

export interface NavLinkProps {
  href: string;
  onClick: () => void;
  label: string;
  mobile?: boolean;
}

export interface IconLinkProps {
  href: string;
  icon: ElementType;
  label: string;
  badgeCount?: number;
}

export interface BottomNavItemProps {
  href?: string;
  icon: ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

