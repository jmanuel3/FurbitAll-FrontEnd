
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("furbitAll_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("furbitAll_cart", JSON.stringify(cart));
  }, [cart]);

  const normalizeProduct = (product) => {
  
    const id = product._id || product.id;
    return {
      id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image || "",
    };
  };

  const addToCart = (product, qty = 1) => {
    const p = normalizeProduct(product);
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx !== -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...p, qty }];
    });
  };

  const updateQty = (id, qty) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, qty } : p));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCart([]);

  const { cartCount, cartTotal } = useMemo(() => {
    const count = cart.reduce((acc, p) => acc + p.qty, 0);
    const total = cart.reduce((acc, p) => acc + p.qty * p.price, 0);
    return { cartCount: count, cartTotal: total };
  }, [cart]);

  const value = {
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};
