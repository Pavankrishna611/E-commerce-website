import React, { useState } from 'react';
import { ShoppingBag, MessageCircle, Eye, Check, Sparkles, ShieldCheck, Heart, Flame } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { generateWhatsAppUrl, formatWhatsAppOrderMessage } from '../../utils/whatsappHelper';

export const ProductCard = ({ product, onQuickView }) => {
  const { addToCart, setIsDrawerOpen } = useCart();
  
  // Selected weight variant state (defaults to first variant or 500g if present)
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(() => {
    const popularIndex = product.weightVariants?.findIndex(v => v.weight.includes('500g'));
    return popularIndex > -1 ? popularIndex : 0;
  });

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const selectedVariant = product.weightVariants?.[selectedVariantIndex] || {
    weight: '250g',
    price: 110,
    originalPrice: 140,
    savingsText: '',
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleDirectWhatsAppBuy = () => {
    const itemTotal = selectedVariant.price * quantity;
    const msg = formatWhatsAppOrderMessage({
      items: [
        {
          title: product.title,
          weight: selectedVariant.weight,
          quantity: quantity,
          unitPrice: selectedVariant.price,
          totalPrice: itemTotal,
        },
      ],
      subtotal: itemTotal,
      grandTotal: itemTotal >= 499 ? itemTotal : itemTotal + 40,
      deliveryFee: itemTotal >= 499 ? 0 : 40,
    });
    
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  const savingsAmount = selectedVariant.originalPrice - selectedVariant.price;
  const savingsPercentage = Math.round((savingsAmount / selectedVariant.originalPrice) * 100);

  return (
    <div className="group bg-white rounded-2xl border border-oat-border hover:border-primary/50 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between overflow-hidden relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-jaggery-50">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Top Left Badge Tag */}
        {product.badgeTag && (
          <div className="absolute top-3 left-3 bg-espresso/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
            {product.badgeTag}
          </div>
        )}

        {/* Quick View Button on Hover */}
        <button
          onClick={() => onQuickView && onQuickView(product)}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white text-espresso p-2 rounded-xl shadow-md opacity-90 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-105"
          title="View Nutrition & Recipe Details"
          aria-label="View Nutrition & Recipe Details"
        >
          <Eye className="w-4 h-4 text-primary" />
        </button>

        {/* Discount Ribbon on Image */}
        {savingsPercentage > 0 && (
          <div className="absolute bottom-3 left-3 bg-secondary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-sm uppercase tracking-wider">
            {savingsPercentage}% OFF
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title, Subtitle, and Ratings */}
        <div className="space-y-1.5">
          {/* Category */}
          <div className="flex items-center justify-between text-xs text-espresso-muted">
            <span className="font-semibold text-secondary uppercase tracking-wider text-[11px]">{product.category}</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              100% Traditional
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView && onQuickView(product)}
            className="font-heading font-bold text-lg text-espresso group-hover:text-primary transition-colors cursor-pointer line-clamp-1"
          >
            {product.title}
          </h3>

          {/* Subtitle / Short description */}
          <p className="text-xs text-espresso/70 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Health Trust Badges Strip (100% Veg, High Protein, Rich in Iron) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {product.highlights?.slice(0, 3).map((badge, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 text-[10px] font-semibold bg-oat text-espresso-light px-2 py-0.5 rounded-md border border-oat-border"
            >
              <span className="w-1 h-1 rounded-full bg-primary"></span>
              {badge}
            </span>
          ))}
        </div>

        {/* Weight Customization Dropdown / Selector (Dynamically updates price) */}
        <div className="space-y-1.5 pt-2 border-t border-oat-border/80">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-espresso">Select Weight / Pack:</label>
            {selectedVariant.savingsText && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {selectedVariant.savingsText}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {product.weightVariants?.map((variant, index) => (
              <button
                key={variant.weight}
                type="button"
                onClick={() => setSelectedVariantIndex(index)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all duration-200 text-center ${
                  selectedVariantIndex === index
                    ? 'bg-primary text-white border-primary shadow-sm scale-[1.02]'
                    : 'bg-oat-light text-espresso border-oat-border hover:border-primary/40 hover:bg-jaggery-50'
                }`}
              >
                {variant.weight}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Price Display */}
        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-extrabold text-espresso">
              ₹{selectedVariant.price}
            </span>
            {selectedVariant.originalPrice > selectedVariant.price && (
              <span className="text-xs text-espresso-muted line-through">
                ₹{selectedVariant.originalPrice}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            In Stock • Fresh Batch
          </span>
        </div>

        {/* Action Buttons: Add to Cart & Buy via WhatsApp */}
        <div className="space-y-2 pt-2">
          
          {/* Quantity Controls & Add to Cart Button */}
          <div className="flex items-center gap-2">
            {/* Quantity Selector */}
            <div className="flex items-center border border-oat-border rounded-xl bg-oat-light p-1">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-espresso font-bold text-sm transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-bold text-espresso">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-espresso font-bold text-sm transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-2.5 px-3 rounded-xl font-heading font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-300 shadow-sm ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary hover:bg-primary-hover text-white active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Buy via WhatsApp 1-Click Button */}
          <button
            onClick={handleDirectWhatsAppBuy}
            className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Buy {selectedVariant.weight} via WhatsApp (₹{selectedVariant.price * quantity})</span>
          </button>

        </div>

      </div>

    </div>
  );
};
