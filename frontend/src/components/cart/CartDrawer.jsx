import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag, ShieldCheck, MessageCircle, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer = ({ onProceedToCheckout }) => {
  const {
    items,
    isDrawerOpen,
    setIsDrawerOpen,
    updateQuantity,
    updateItemWeight,
    removeFromCart,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    isFreeDelivery,
    amountToFreeDelivery,
    freeShippingThreshold,
    appliedCoupon,
    couponCode,
    setCouponCode,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState('');

  if (!isDrawerOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyCoupon(inputCode);
      setInputCode('');
    }
  };

  const progressPercentage = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      
      {/* In-page Centered Modal (No Sidewise Scrolling) */}
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative max-h-[90vh] flex flex-col">
        
        {/* Cart Header */}
        <div className="p-5 border-b border-oat-border flex items-center justify-between bg-oat flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-md">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-espresso">Your Snack Cart</h3>
              <p className="text-xs text-espresso-muted">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
            </div>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-2 rounded-xl text-espresso/60 hover:text-espresso hover:bg-white transition-colors"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Meter */}
        <div className="bg-jaggery-50 px-5 py-3 border-b border-jaggery-100 flex-shrink-0">
          <div className="flex items-center justify-between text-xs font-semibold text-espresso mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-primary" />
              {isFreeDelivery ? '🎉 FREE Priority Delivery Unlocked!' : `Add ₹${amountToFreeDelivery} for FREE Delivery`}
            </span>
            <span className="font-bold text-secondary">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-jaggery-200/60 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Cart Items Scrollable List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-jaggery-100 flex items-center justify-center mx-auto text-3xl">
                🥜
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-espresso">Your cart is empty</h4>
                <p className="text-xs text-espresso-muted">Add some homemade jaggery chikkis to get started!</p>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:bg-primary-hover transition-colors"
              >
                Explore Fresh Chikkis
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3.5 p-3.5 bg-oat rounded-2xl border border-oat-border relative group"
              >
                {/* Item Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover bg-white flex-shrink-0 border border-oat-border"
                />

                {/* Item Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-espresso line-clamp-1">
                        {item.title}
                      </h4>
                      
                      {/* Weight Variant Switcher in Cart */}
                      {item.availableVariants && item.availableVariants.length > 1 ? (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-[10px] text-espresso-muted font-medium">Weight:</span>
                          <select
                            value={item.weight}
                            onChange={(e) => {
                              const newVar = item.availableVariants.find(v => v.weight === e.target.value);
                              if (newVar) updateItemWeight(item.id, newVar);
                            }}
                            className="text-[11px] font-semibold bg-white border border-oat-border rounded-lg px-1.5 py-0.5 text-secondary focus:border-primary outline-none cursor-pointer"
                          >
                            {item.availableVariants.map((v) => (
                              <option key={v.weight} value={v.weight}>
                                {v.weight} (₹{v.price})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-secondary bg-white px-2 py-0.5 rounded border border-oat-border">
                          {item.weight}
                        </span>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-espresso/40 hover:text-rose-500 p-1 rounded transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Price & Quantity Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs font-bold text-espresso">
                      ₹{item.totalPrice}{' '}
                      <span className="text-[10px] text-espresso-muted font-normal">
                        (₹{item.unitPrice} each)
                      </span>
                    </div>

                    <div className="flex items-center border border-oat-border rounded-xl bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-oat text-espresso font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-oat text-espresso font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}

          {/* Promo Code Form */}
          {items.length > 0 && (
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>{appliedCoupon.code} applied ({appliedCoupon.description})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. VINAYAKA10)"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-3 py-2 bg-oat border border-oat-border rounded-xl text-xs uppercase font-mono focus:bg-white focus:border-primary outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary hover:bg-secondary-hover text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-5 border-t border-oat-border bg-white space-y-3.5 flex-shrink-0 shadow-elevated">
            
            {/* Cost Summary */}
            <div className="space-y-1.5 text-xs text-espresso">
              <div className="flex justify-between">
                <span className="text-espresso/70">Subtotal:</span>
                <span className="font-semibold">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount:</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-espresso/70">Delivery Fee:</span>
                <span className="font-semibold">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-heading font-extrabold text-espresso pt-2 border-t border-oat-border">
                <span>Grand Total:</span>
                <span className="text-primary text-base font-extrabold">₹{grandTotal}</span>
              </div>
            </div>

            {/* WhatsApp Checkout Trigger */}
            <div className="space-y-1.5">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-elevated hover:shadow-glow transition-all duration-300 active:scale-95"
              >
                <span>Proceed to WhatsApp Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-espresso/60 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct WhatsApp order placement with seller confirmation</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
