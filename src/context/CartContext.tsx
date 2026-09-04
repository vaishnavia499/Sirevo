import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CuratedProduct } from '../types';

export interface CartContextType {
  cart: CuratedProduct[];
  cartCount: number;
  addToCart: (product: CuratedProduct) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode; initialCart?: CuratedProduct[] }> = ({ 
  children, 
  initialCart = [] 
}) => {
  // Clear Initial State: Initialize the cart state as an empty array ([]) rather than including default items
  const [cart, setCart] = useState<CuratedProduct[]>(initialCart);

  const addToCart = (product: CuratedProduct) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const index = prev.findIndex(p => (p.product_id || (p as any).id) === productId);
      if (index !== -1) {
        return [...prev.slice(0, index), ...prev.slice(index + 1)];
      }
      return prev.filter(p => (p.product_id || (p as any).id) !== productId);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (productId: string): boolean => {
    if (!productId) return false;
    return cart.some(p => (p.product_id || (p as any).id) === productId);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.length,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    return {
      cart: [],
      cartCount: 0,
      addToCart: () => {},
      removeFromCart: () => {},
      clearCart: () => {},
      isInCart: () => false
    };
  }
  return context;
};

export default CartContext;
