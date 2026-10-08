import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { Search, SlidersHorizontal, Sparkles, Filter, Check } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Traditional Chikkis',
  'Premium Dry Fruit',
  'Seed & Healthy',
  'Festive Hampers',
];

const DIETARY_TAGS = [
  { id: 'All', label: 'All Highlights' },
  { id: 'Vegetarian', label: '100% Vegetarian' },
  { id: 'Protein', label: 'High Protein' },
  { id: 'Iron', label: 'Rich in Iron' },
  { id: 'Sugar', label: 'Zero White Sugar' },
  { id: 'Brass', label: 'Brass Kadhai' },
];

export const ProductGrid = ({ products, onQuickView }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [selectedHighlight, setSelectedHighlight] = useState('All');

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients?.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesHighlight =
      selectedHighlight === 'All' ||
      product.highlights?.some((h) => h.toLowerCase().includes(selectedHighlight.toLowerCase())) ||
      (selectedHighlight === 'Brass' && product.story?.toLowerCase().includes('brass'));

    return matchesCategory && matchesSearch && matchesHighlight;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') {
      return a.weightVariants[0].price - b.weightVariants[0].price;
    } else if (sortBy === 'price-high') {
      return b.weightVariants[0].price - a.weightVariants[0].price;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'bestseller') {
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    }
    return 0; // default featured
  });

  return (
    <section id="products" className="py-16 bg-oat/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-jaggery-100 text-secondary text-xs font-bold uppercase tracking-wider border border-jaggery-200">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Fresh From Our Kitchen
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-espresso tracking-tight">
            Artisanal Traditional Chikki Catalog
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 leading-relaxed">
            Select your preferred custom weight pack (250g, 500g, 1kg) for real-time discounted prices. Hand-poured with love in pure desi jaggery.
          </p>
        </div>

        {/* Options & Filter Panel - Clean, Equally Separated Options */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-oat-border shadow-soft mb-10 space-y-5">
          
          {/* Row 1: Search and Sorting Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-oat-border">
            
            {/* Search Box */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-espresso-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search peanut, sesame, dry fruit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all placeholder:text-espresso/40 font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-espresso-muted hover:text-espresso"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-bold text-espresso-muted flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-2.5 px-3.5 rounded-xl bg-oat border border-oat-border text-xs font-semibold text-espresso focus:border-primary outline-none cursor-pointer"
              >
                <option value="featured">✨ Featured Collection</option>
                <option value="bestseller">🔥 Top Bestsellers</option>
                <option value="rating">⭐ Highest Rated</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💎 Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Row 2: Category Options Panel - EQUALLY SEPARATED GRID */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-secondary block">
              Categories:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-heading font-bold text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-xs ${
                    selectedCategory === cat
                      ? 'bg-primary text-white shadow-md scale-[1.02] border border-primary'
                      : 'bg-oat text-espresso hover:bg-jaggery-100 hover:text-primary border border-oat-border'
                  }`}
                >
                  <span>{cat === 'All' ? '🌟 All Varieties' : cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Dietary Highlights Filter Panel - EQUALLY SEPARATED GRID */}
          <div className="space-y-2 pt-2 border-t border-oat-border">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Health & Purity Filters:
              </label>
              {(selectedCategory !== 'All' || selectedHighlight !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSelectedHighlight('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-secondary font-bold hover:underline"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 w-full">
              {DIETARY_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => setSelectedHighlight(tag.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold text-center border transition-all flex items-center justify-center gap-1 ${
                    selectedHighlight === tag.id
                      ? 'bg-secondary text-white border-secondary shadow-xs font-bold'
                      : 'bg-oat/60 text-espresso/80 border-oat-border hover:border-secondary hover:bg-white'
                  }`}
                >
                  {selectedHighlight === tag.id && <Check className="w-3 h-3 flex-shrink-0" />}
                  <span className="truncate">{tag.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product._id || product.slug}
                product={product}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-oat-border max-w-md mx-auto space-y-3 shadow-soft">
            <div className="text-4xl">🥜</div>
            <h3 className="font-heading font-bold text-lg text-espresso">No chikkis matched your filter</h3>
            <p className="text-xs text-espresso-muted">Try resetting search filters to view all fresh batches.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setSelectedHighlight('All');
              }}
              className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
