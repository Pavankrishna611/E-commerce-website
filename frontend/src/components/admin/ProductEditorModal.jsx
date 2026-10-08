import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Save, Image as ImageIcon, Sparkles, ShieldCheck, Tag, DollarSign, Wand2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const DEFAULT_CATEGORIES = [
  'Traditional Chikkis',
  'Premium Dry Fruit',
  'Seed & Healthy',
  'Festive Hampers',
];

// Curated stock photos for fast selection
const PRESET_IMAGES = [
  { label: '🥜 Peanut / Groundnut', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop' },
  { label: '⚪ Sesame / Til Patti', url: 'https://res.cloudinary.com/k84w0prr/image/upload/v1788266818/sesame%20laddu.png' },
  { label: '🌰 Royal Dry Fruit', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop' },
  { label: '🥥 Coconut Delight', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop' },
  { label: '🍬 Peanut Laddu Bites', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800&auto=format&fit=crop' },
  { label: '🌱 Flaxseed Superfood', url: '/images/flaxseed-laddu.jpg' },
  { label: '🎁 Festive Gift Hamper', url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop' },
];

export const ProductEditorModal = ({ product, isOpen, onClose, onSave }) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [category, setCategory] = useState('Traditional Chikkis');
  const [image, setImage] = useState('');
  const [badgeTag, setBadgeTag] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestseller, setIsBestseller] = useState(false);
  const [shelfLife, setShelfLife] = useState('90 Days from packaging');
  const [highlightsInput, setHighlightsInput] = useState('');
  
  // Weight Variants array
  const [weightVariants, setWeightVariants] = useState([
    { weight: '250g', price: 120, originalPrice: 150, inStock: true, savingsText: 'Save ₹30' },
    { weight: '500g', price: 230, originalPrice: 300, inStock: true, savingsText: 'Save ₹70 (Recommended)' },
    { weight: '1kg', price: 440, originalPrice: 600, inStock: true, savingsText: 'Save ₹160 (Best Value)' },
  ]);

  useEffect(() => {
    if (product) {
      setTitle(product.title || '');
      setSubtitle(product.subtitle || '');
      setDescription(product.description || '');
      setStory(product.story || '');
      setCategory(product.category || 'Traditional Chikkis');
      setImage(product.image || '');
      setBadgeTag(product.badgeTag || '');
      setIsFeatured(!!product.isFeatured);
      setIsBestseller(!!product.isBestseller);
      setShelfLife(product.shelfLife || '90 Days from packaging');
      setHighlightsInput(product.highlights?.join(', ') || '100% Vegetarian, High Protein, Rich in Iron, Zero White Sugar');
      setWeightVariants(
        product.weightVariants && product.weightVariants.length > 0
          ? product.weightVariants.map((v) => ({ ...v }))
          : [
              { weight: '250g', price: 120, originalPrice: 150, inStock: true, savingsText: 'Save ₹30' },
            ]
      );
    } else {
      // New product default state
      setTitle('');
      setSubtitle('');
      setDescription('');
      setStory('');
      setCategory('Traditional Chikkis');
      setImage(PRESET_IMAGES[0].url);
      setBadgeTag('✨ New Batch');
      setIsFeatured(false);
      setIsBestseller(false);
      setShelfLife('90 Days from packaging');
      setHighlightsInput('100% Vegetarian, High Protein, Rich in Iron, Zero White Sugar');
      setWeightVariants([
        { weight: '250g', price: 120, originalPrice: 150, inStock: true, savingsText: 'Save ₹30' },
        { weight: '500g', price: 230, originalPrice: 300, inStock: true, savingsText: 'Save ₹70 (Recommended)' },
        { weight: '1kg', price: 440, originalPrice: 600, inStock: true, savingsText: 'Save ₹160 (Best Value)' },
      ]);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleVariantChange = (index, field, value) => {
    setWeightVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      if (field === 'price' || field === 'originalPrice') {
        const p = field === 'price' ? Number(value) : updated[index].price;
        const op = field === 'originalPrice' ? Number(value) : updated[index].originalPrice;
        if (op > p) {
          updated[index].savingsText = `Save ₹${op - p}`;
        }
      }
      return updated;
    });
  };

  const handleAddVariant = () => {
    setWeightVariants((prev) => [
      ...prev,
      { weight: '2kg Family Pack', price: 850, originalPrice: 1100, inStock: true, savingsText: 'Save ₹250 (Mega Saver)' },
    ]);
  };

  const handleRemoveVariant = (index) => {
    if (weightVariants.length <= 1) {
      addToast('Product must have at least one weight pack', 'error');
      return;
    }
    setWeightVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      addToast('Product title and description are required', 'error');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      story: story.trim(),
      category,
      image: image.trim() || PRESET_IMAGES[0].url,
      badgeTag: badgeTag.trim(),
      isFeatured,
      isBestseller,
      shelfLife,
      highlights: highlightsInput.split(',').map((h) => h.trim()).filter(Boolean),
      weightVariants: weightVariants.map((v) => ({
        weight: v.weight,
        price: Number(v.price),
        originalPrice: Number(v.originalPrice || Math.round(v.price * 1.25)),
        inStock: v.inStock !== false,
        savingsText: v.savingsText || '',
      })),
    };

    onSave(payload, product?._id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-espresso via-secondary to-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl font-bold">
              {product ? '✏️' : '➕'}
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">
                {product ? `Edit Product: ${product.title}` : 'Add New Snack to Store'}
              </h3>
              <p className="text-xs text-white/80">Configure weights, pricing, images, and trust badges</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* 1. Basic Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <Tag className="w-4 h-4" /> 1. Basic Product Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaju Palm Jaggery Chikki"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-medium text-espresso focus:bg-white focus:border-primary outline-none cursor-pointer"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Subtitle / Regional Name</label>
              <input
                type="text"
                placeholder="e.g. Handcrafted Andhra Cashew & Palm Jaggery Bar"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">Short Description *</label>
              <textarea
                rows={2}
                required
                placeholder="Crisp, slow-roasted cashews folded in aromatic dark palm jaggery with a dash of cardamom."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none resize-none"
              />
            </div>
          </div>

          {/* 2. Weight Customization Matrix */}
          <div className="space-y-3 pt-2 border-t border-oat-border">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> 2. Weight Packs & Dynamic Price Calculator
              </h4>
              <button
                type="button"
                onClick={handleAddVariant}
                className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-hover transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Weight Pack
              </button>
            </div>

            <div className="space-y-2.5">
              {weightVariants.map((variant, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-oat rounded-2xl border border-oat-border grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                >
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-espresso-muted mb-0.5">Weight / Pack</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 250g"
                      value={variant.weight}
                      onChange={(e) => handleVariantChange(idx, 'weight', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs font-bold text-espresso"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-espresso-muted mb-0.5">Selling Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="120"
                      value={variant.price}
                      onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs font-bold text-primary"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-espresso-muted mb-0.5">MRP Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      placeholder="150"
                      value={variant.originalPrice}
                      onChange={(e) => handleVariantChange(idx, 'originalPrice', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs font-medium text-espresso"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-espresso-muted mb-0.5">Savings Tag</label>
                    <input
                      type="text"
                      placeholder="Save ₹30"
                      value={variant.savingsText || ''}
                      onChange={(e) => handleVariantChange(idx, 'savingsText', e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs text-emerald-700 font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between gap-2 pt-2 sm:pt-0">
                    <label className="flex items-center gap-1 text-[11px] font-semibold text-espresso cursor-pointer">
                      <input
                        type="checkbox"
                        checked={variant.inStock !== false}
                        onChange={(e) => handleVariantChange(idx, 'inStock', e.target.checked)}
                        className="rounded text-primary focus:ring-0"
                      />
                      <span>In Stock</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1.5 text-espresso/40 hover:text-rose-500 rounded transition-colors"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Image Selection & Preset Picker */}
          <div className="space-y-3 pt-2 border-t border-oat-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4" /> 3. Product Photo & Quick Presets
            </h4>

            {/* Quick Preset Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-espresso-muted font-semibold">1-Click Photo Presets:</span>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      image === preset.url
                        ? 'bg-secondary text-white border-secondary shadow-xs'
                        : 'bg-oat text-espresso border-oat-border hover:border-secondary'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 space-y-2">
                <div>
                  <label className="block text-xs font-semibold text-espresso mb-1">Custom Image URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="🔥 Bestseller"
                      value={badgeTag}
                      onChange={(e) => setBadgeTag(e.target.value)}
                      className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">Shelf Life</label>
                    <input
                      type="text"
                      placeholder="90 Days"
                      value={shelfLife}
                      onChange={(e) => setShelfLife(e.target.value)}
                      className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-2 bg-oat rounded-2xl border border-oat-border h-28 overflow-hidden">
                {image ? (
                  <img src={image} alt="Product Preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <span className="text-xs text-espresso-muted">No Image</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Trust Highlights (Comma Separated)
              </label>
              <input
                type="text"
                placeholder="100% Vegetarian, High Protein, Rich in Iron, Zero Added Cane Sugar"
                value={highlightsInput}
                onChange={(e) => setHighlightsInput(e.target.value)}
                className="w-full px-3 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
              />
            </div>

            {/* Visibility Toggles */}
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 text-xs font-semibold text-espresso cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-primary focus:ring-0 w-4 h-4"
                />
                <span>Feature on Homepage Hero</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-espresso cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-primary focus:ring-0 w-4 h-4"
                />
                <span>Mark as Top Bestseller</span>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-oat-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-oat-border text-xs font-bold text-espresso hover:bg-oat transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{product ? 'Save Changes' : 'Publish Product to Store'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
