import React from 'react';
import { Sparkles, Truck, ShieldCheck, Phone, Heart, Award } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const AnnouncementBar = () => {
  const { amountToFreeDelivery, isFreeDelivery, freeShippingThreshold } = useCart();

  const TICKER_ITEMS = [
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />,
      text: (
        <span>
          100% Traditional Homemade Sweets • <strong className="text-white">Pure Desi Jaggery</strong> • Zero Bleached Sugar
        </span>
      ),
    },
    {
      icon: <Truck className="w-3.5 h-3.5 text-amber-300 animate-bounce" />,
      text: isFreeDelivery ? (
        <span className="text-emerald-300 font-bold">
          🎉 Congratulations! You unlocked FREE Priority Delivery across India!
        </span>
      ) : (
        <span>
          Add <strong className="text-amber-300 font-bold">₹{amountToFreeDelivery}</strong> more for <strong className="text-white">FREE Traditional Box Delivery</strong> (Min ₹{freeShippingThreshold})
        </span>
      ),
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      text: (
        <span>
          Special Offer: Use Coupon <strong className="text-white bg-primary px-1.5 py-0.5 rounded font-mono font-bold text-[11px] shadow-xs">VINAYAKA10</strong> for 10% OFF
        </span>
      ),
    },
    {
      icon: <Phone className="w-3.5 h-3.5 text-emerald-400" />,
      text: (
        <span>
          WhatsApp Helpline & Direct Orders: <strong className="text-white">+91 99498 46972</strong>
        </span>
      ),
    },
    {
      icon: <Award className="w-3.5 h-3.5 text-amber-300" />,
      text: (
        <span>
          🔥 Handcrafted in Brass Kadhais • <strong className="text-white">35-Year Godavari Recipe</strong>
        </span>
      ),
    },
    {
      icon: <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />,
      text: (
        <span>
          Triple Vacuum Sealed for <strong className="text-white">90-Day Crisp Freshness</strong>
        </span>
      ),
    },
  ];

  return (
    <div className="bg-espresso text-oat-light py-2 border-b border-primary/40 relative overflow-hidden select-none">
      
      {/* Infinite Scrolling Ticker Track */}
      <div className="animate-marquee-scroll flex items-center">
        
        {/* Set 1 */}
        <div className="flex items-center gap-8 px-4 flex-shrink-0">
          {TICKER_ITEMS.map((item, index) => (
            <div
              key={`set1-${index}`}
              className="flex items-center gap-2 text-xs sm:text-sm text-oat/90 font-medium whitespace-nowrap"
            >
              {item.icon}
              {item.text}
              <span className="text-white/30 ml-6">•</span>
            </div>
          ))}
        </div>

        {/* Set 2 (for seamless loop) */}
        <div className="flex items-center gap-8 px-4 flex-shrink-0" aria-hidden="true">
          {TICKER_ITEMS.map((item, index) => (
            <div
              key={`set2-${index}`}
              className="flex items-center gap-2 text-xs sm:text-sm text-oat/90 font-medium whitespace-nowrap"
            >
              {item.icon}
              {item.text}
              <span className="text-white/30 ml-6">•</span>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
