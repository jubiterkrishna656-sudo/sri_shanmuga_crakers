import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { productAPI } from '../utils/api';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'cart';

const loadCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : { items: [] };
    return { items: Array.isArray(data.items) ? data.items : [] };
  } catch {
    return { items: [] };
  }
};

const saveCart = (cart) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);
  const cartRef = useRef(cart);
  cartRef.current = cart;

  const updateState = useCallback((updater) => {
    setCart(prev => {
      const next = { items: typeof updater === 'function' ? updater(prev.items) : updater };
      saveCart(next);
      return next;
    });
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await productAPI.getById(productId);
      const product = res.data;
      if (product.stock <= 0) {
        toast.error('Product is out of stock');
        return false;
      }
      const current = cart.items.find(i => i.productId === productId);
      const newQty = (current?.quantity || 0) + quantity;
      if (newQty > product.stock) {
        toast.error(`Only ${product.stock} item(s) left in stock`);
        return false;
      }
      const itemData = {
        name: product.name,
        image: product.image,
        price: product.discountPrice || product.price,
        stock: product.stock
      };
      if (current) {
        updateState(cart.items.map(i => i.productId === productId ? { ...i, ...itemData, quantity: newQty } : i));
      } else {
        updateState([...cart.items, { _id: productId, productId, ...itemData, quantity }]);
      }
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to add');
      return false;
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.items.find(i => i.productId === productId);
    if (!item) return;
    if (quantity > item.stock) {
      toast.error(`Only ${item.stock} item(s) left in stock`);
      return;
    }
    updateState(cart.items.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const removeFromCart = async (productId) => {
    updateState(cart.items.filter(i => i.productId !== productId));
    toast.success('Removed from cart');
  };

  const clearCart = async () => {
    updateState([]);
  };

  // Re-validate cached prices/names/stock against the server so the cart never
  // shows stale data. Removes items whose product was deleted and clamps
  // quantities down to the current stock level.
  const refreshCart = useCallback(async () => {
    const items = cartRef.current.items;
    if (items.length === 0) return;
    try {
      const results = await Promise.allSettled(items.map(i => productAPI.getById(i.productId)));
      const freshMap = new Map();
      results.forEach((r, idx) => {
        const id = items[idx].productId;
        if (r.status === 'fulfilled') freshMap.set(id, r.value.data);
      });
      updateState(current => current.flatMap(i => {
        const p = freshMap.get(i.productId);
        if (!p) return [];
        const quantity = p.stock > 0 ? Math.min(i.quantity, p.stock) : 0;
        if (quantity <= 0) return [];
        return [{ ...i, name: p.name, image: p.image, price: p.discountPrice || p.price, stock: p.stock, quantity }];
      }));
    } catch {
      // Network failure — keep the cached values, server re-validates at order time.
    }
  }, [updateState]);

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
