import React, { useState } from 'react';
import { X, ShieldCheck, Heart, Award, CheckCircle2, MessageCircle, ShoppingBag, Truck, Clock } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { generateWhatsAppUrl, formatWhatsAppOrderMessage } from '../../utils/whatsappHelper';

export const ProductDetailModal = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('nutrition'); // nutrition, ingredients, story, reviews

  if (!product) return null;

  const selectedVariant = product.weightVariants?.[selectedVariantIndex] || {
    weight: '250g',
    price: 110,
    originalPrice: 140,
    savingsText: '',
  };

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
  };

  const handleWhatsAppCheckout = () => {
    const total = selectedVariant.price * quantity;
    const msg = formatWhatsAppOrderMessage({
      items: [
        {
          title: product.title,
          weight: selectedVariant.weight,
          quantity,
          unitPrice: selectedVariant.price,
          totalPrice: total,
        },
      ],
      subtotal: total,
      grandTotal: total >= 499 ? total : total + 40,
      deliveryFee: total >= 499 ? 0 : 40,
    });
    window.open(generateWhatsAppUrl(msg), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative max-h-[90vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-espresso flex items-center justify-center shadow-md transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          
          {/* Top Product Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Image (5 cols) */}
            <div className="md:col-span-5 relative rounded-2xl overflow-hidden bg-jaggery-100 aspect-square">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.badgeTag && (
                <div className="absolute top-3 left-3 bg-espresso/90 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  {product.badgeTag}
                </div>
              )}
            </div>

            {/* Right Header Details (7 cols) */}
            <div className="md:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-jaggery-100 px-2.5 py-0.5 rounded-md">{product.category}</span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  ✨ 100% Traditional Recipe
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-espresso">
                {product.title}
              </h2>
              <p className="text-xs sm:text-sm text-espresso/70 leading-relaxed">
                {product.description}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2 pt-1">
                {product.highlights?.map((h, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs font-semibold bg-jaggery-100/70 text-secondary px-2.5 py-1 rounded-lg border border-jaggery-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    {h}
                  </span>
                ))}
              </div>

              {/* Weight Customization Selector */}
              <div className="space-y-2 pt-3 border-t border-oat-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-espresso">Select Weight Variant:</span>
                  {selectedVariant.savingsText && (
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedVariant.savingsText}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {product.weightVariants?.map((v, i) => (
                    <button
                      key={v.weight}
                      onClick={() => setSelectedVariantIndex(i)}
                      className={`p-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        selectedVariantIndex === i
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-oat text-espresso border-oat-border hover:border-primary/40'
                      }`}
                    >
                      <div>{v.weight}</div>
                      <div className={`text-[11px] font-semibold ${selectedVariantIndex === i ? 'text-amber-100' : 'text-primary'}`}>
                        ₹{v.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Quantity Bar */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-3xl font-heading font-extrabold text-espresso">
                    ₹{selectedVariant.price * quantity}
                  </div>
                  {selectedVariant.originalPrice > selectedVariant.price && (
                    <div className="text-xs text-espresso-muted line-through">
                      MRP: ₹{selectedVariant.originalPrice * quantity}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="flex items-center border border-oat-border rounded-xl bg-oat p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-espresso font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-espresso">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-espresso font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Action CTAs inside modal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="py-3 px-6 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add {quantity} × {selectedVariant.weight} to Cart</span>
            </button>

            <button
              onClick={handleWhatsAppCheckout}
              className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Order Instantly on WhatsApp</span>
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-t border-oat-border pt-4">
            <div className="flex items-center gap-4 border-b border-oat-border text-xs sm:text-sm font-semibold pb-2">
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`pb-2 transition-colors relative ${
                  activeTab === 'nutrition' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                🥗 Nutritional Facts
                {activeTab === 'nutrition' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-2 transition-colors relative ${
                  activeTab === 'ingredients' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                🌿 Pure Ingredients
                {activeTab === 'ingredients' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
              </button>
              <button
                onClick={() => setActiveTab('story')}
                className={`pb-2 transition-colors relative ${
                  activeTab === 'story' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
                }`}
              >
                📜 Artisan Recipe
                {activeTab === 'story' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="pt-4">
              
              {/* Tab 1: Nutrition Info Table */}
              {activeTab === 'nutrition' && (
                <div className="space-y-4">
                  <div className="bg-oat rounded-2xl p-4 border border-oat-border">
                    <div className="text-xs font-bold text-espresso uppercase tracking-wider mb-2">
                      Nutritional Values (Approx Per {product.nutritionalInfo?.servingSize || '100g'})
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="p-2.5 bg-white rounded-xl border border-oat-border">
                        <div className="text-xs text-espresso-muted">Energy</div>
                        <div className="text-sm font-bold text-espresso">{product.nutritionalInfo?.energy}</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-oat-border">
                        <div className="text-xs text-espresso-muted">Protein</div>
                        <div className="text-sm font-bold text-emerald-700">{product.nutritionalInfo?.protein}</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-oat-border">
                        <div className="text-xs text-espresso-muted">Iron</div>
                        <div className="text-sm font-bold text-primary">{product.nutritionalInfo?.iron}</div>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-oat-border">
                        <div className="text-xs text-espresso-muted">Added Sugar</div>
                        <div className="text-sm font-bold text-emerald-600">{product.nutritionalInfo?.addedSugar}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-espresso-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-primary" /> Shelf Life: {product.shelfLife}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-primary" /> Packed Fresh on Order Date
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 2: Ingredients */}
              {activeTab === 'ingredients' && (
                <div className="space-y-3">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-espresso">
                    {product.ingredients?.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 p-2.5 bg-oat rounded-xl border border-oat-border">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-espresso-muted italic">
                    *Storage: {product.storageAdvice}
                  </p>
                </div>
              )}

              {/* Tab 3: Story */}
              {activeTab === 'story' && (
                <div className="space-y-3 text-xs sm:text-sm text-espresso/80 leading-relaxed bg-oat p-4 rounded-2xl border border-oat-border">
                  <p>{product.story || product.description}</p>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
