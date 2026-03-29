"use client";

import { createContext, useContext, useState } from "react";

interface MenuContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MenuContext = createContext<MenuContextType>({
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <MenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
