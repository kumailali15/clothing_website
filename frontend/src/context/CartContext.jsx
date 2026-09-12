import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopco_cart');
      return saved ? JSON.parse(saved) : [
        {
          id: 'cart-init-1',
          productId: 'prod-10',
          title: 'Gradient Graphic T-shirt',
          price: 145,
          image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
          size: 'Large',
          color: 'Optic White',
          quantity: 1
        },
        {
          id: 'cart-init-2',
          productId: 'prod-3',
          title: 'Checkered Shirt',
          price: 180,
          image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
          size: 'Medium',
          color: 'Crimson Plaid',
          quantity: 1
        },
        {
          id: 'cart-init-3',
          productId: 'prod-2',
          title: 'Skinny Fit Jeans',
          price: 240,
          image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80',
          size: 'Large',
          color: 'Classic Indigo',
          quantity: 1
        }
      ];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState({
    code: 'SHOP20',
    type: 'percentage',
    value: 20
  });
  const [couponError, setCouponError] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('shopco_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, qty = 1, size = 'Large', color = null) => {
    const chosenColor = color || (product.colors && product.colors[0]?.name) || 'Default';
    const chosenSize = size || (product.sizes && product.sizes[0]) || 'Medium';

    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.size === chosenSize && item.color === chosenColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem = {
          id: 'cart-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.images && product.images[0] ? product.images[0] : '',
          size: chosenSize,
          color: chosenColor,
          quantity: qty
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.title}" to cart!`);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const res = await api.validateCoupon(code);
      if (res.valid) {
        setCoupon(res.coupon);
        showToast(`Promo code "${code}" applied!`);
        return true;
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid promo code');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  let deliveryFee = subtotal > 200 || cartItems.length === 0 ? 0 : 15;

  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === 'shipping') {
      deliveryFee = 0;
    }
  }

  const total = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        couponError,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        deliveryFee,
        total,
        toastMessage
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
