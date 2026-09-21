/**
 * D'fine Store Context - Cart, Modals & Navigation state
 */

import React, { createContext, useContext, useState } from 'react';
import { Product, CartItem } from '../components/common/types';

interface DfineStoreContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  totalItems: number;
  cartCount: number;
  subtotal: number;
  cartTotal: number;
}

const DfineStoreContext = createContext<DfineStoreContextType | undefined>(undefined);

export function DfineStoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedColor: color || product.colors?.[0],
          selectedSize: size || product.sizes?.[0],
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const closeQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <DfineStoreContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        isMenuOpen,
        setIsMenuOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,
        openQuickView: (product: Product) => setQuickViewProduct(product),
        closeQuickView,
        addToCart,
        removeFromCart,
        updateQuantity,
        totalItems,
        cartCount: totalItems,
        subtotal,
        cartTotal: subtotal,
      }}
    >
      {children}
    </DfineStoreContext.Provider>
  );
}

export function useDfineStore() {
  const context = useContext(DfineStoreContext);
  if (!context) {
    throw new Error('useDfineStore must be used within a DfineStoreProvider');
  }
  return context;
}
