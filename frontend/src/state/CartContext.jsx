import React, { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    let total = 0;
    items.forEach(({ product, quantity }) => {
      const price = Number(product.price);
      const discount = product.discount || 0;
      const effective = price * (1 - discount / 100);
      total += effective * quantity;
    });
    return { total };
  }, [items]);

  const value = { items, addToCart, removeFromCart, updateQuantity, clearCart, totals };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

