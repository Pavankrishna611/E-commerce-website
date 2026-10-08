import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 40;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vc_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem('vc_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, selectedVariant, quantity = 1) => {
    if (!product || !selectedVariant) return;

    const variant = selectedVariant;
    const cartItemId = `${product._id || product.slug}-${variant.weight}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            id: cartItemId,
            productId: product._id || product.slug,
            productSlug: product.slug,
            title: product.title,
            image: product.image,
            weight: variant.weight,
            unitPrice: variant.price,
            originalPrice: variant.originalPrice,
            quantity: quantity,
            totalPrice: variant.price * quantity,
            availableVariants: product.weightVariants || [],
          },
        ];
      }
    });

    addToast(`Added ${product.title} (${variant.weight}) to cart!`, 'success');
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              totalPrice: newQuantity * item.unitPrice,
            }
          : item
      )
    );
  };

  const updateItemWeight = (itemId, newWeightVariant) => {
    setItems((prevItems) => {
      const targetItem = prevItems.find((it) => it.id === itemId);
      if (!targetItem) return prevItems;

      const newId = `${targetItem.productId}-${newWeightVariant.weight}`;
      
      // If an item with the new weight already exists, merge them
      const filtered = prevItems.filter((it) => it.id !== itemId);
      const existingNewItem = filtered.find((it) => it.id === newId);

      if (existingNewItem) {
        return filtered.map((it) =>
          it.id === newId
            ? {
                ...it,
                quantity: it.quantity + targetItem.quantity,
                totalPrice: (it.quantity + targetItem.quantity) * newWeightVariant.price,
              }
            : it
        );
      }

      return [
        ...filtered,
        {
          ...targetItem,
          id: newId,
          weight: newWeightVariant.weight,
          unitPrice: newWeightVariant.price,
          originalPrice: newWeightVariant.originalPrice,
          totalPrice: targetItem.quantity * newWeightVariant.price,
        },
      ];
    });

    addToast(`Updated weight to ${newWeightVariant.weight}`, 'info');
  };

  const removeFromCart = (itemId) => {
    setItems((prevItems) => {
      const itemToRemove = prevItems.find((i) => i.id === itemId);
      if (itemToRemove) {
        addToast(`Removed ${itemToRemove.title} from cart`, 'info');
      }
      return prevItems.filter((i) => i.id !== itemId);
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Coupons
  const applyCoupon = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'VINAYAKA10') {
      setAppliedCoupon({ code: 'VINAYAKA10', discountPercent: 10, description: '10% Launch Discount' });
      addToast('Coupon VINAYAKA10 applied! (10% OFF)', 'success');
      return { success: true };
    } else if (clean === 'SWEETDEAL') {
      setAppliedCoupon({ code: 'SWEETDEAL', flatDiscount: 50, description: '₹50 Instant Discount' });
      addToast('Coupon SWEETDEAL applied! (₹50 OFF)', 'success');
      return { success: true };
    } else if (clean === 'FESTIVE20') {
      setAppliedCoupon({ code: 'FESTIVE20', discountPercent: 20, description: '20% Festive Savings' });
      addToast('Coupon FESTIVE20 applied! (20% OFF)', 'success');
      return { success: true };
    } else {
      addToast('Invalid coupon code. Try VINAYAKA10 or SWEETDEAL', 'error');
      return { success: false, error: 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  // Calculations
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      discount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      discount = Math.min(appliedCoupon.flatDiscount, subtotal);
    }
  }

  const isFreeDelivery = subtotal >= FREE_SHIPPING_THRESHOLD;
  const deliveryFee = items.length === 0 ? 0 : (isFreeDelivery ? 0 : STANDARD_SHIPPING_FEE);
  const amountToFreeDelivery = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const grandTotal = Math.max(0, subtotal - discount + deliveryFee);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemCount,
        subtotal,
        discount,
        deliveryFee,
        grandTotal,
        isFreeDelivery,
        amountToFreeDelivery,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        appliedCoupon,
        couponCode,
        setCouponCode,
        applyCoupon,
        removeCoupon,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        updateItemWeight,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
