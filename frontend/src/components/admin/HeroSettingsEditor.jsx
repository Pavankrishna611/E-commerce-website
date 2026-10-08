import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Sparkles, RefreshCw, Wand2, ShieldCheck, Check } from 'lucide-react';
import { DEFAULT_HERO_SETTINGS } from '../../data/heroSettings';
import { useToast } from '../../context/ToastContext';

const PRESET_HERO_PHOTOS = [
  {
    label: '🥜 Peanut Chikki (Classic)',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop',
    badge: 'Signature Specialty',
    title: 'Homemade Peanut & Jaggery Chikki',
    subtitle: 'AAA Saurashtra Peanuts + Pure Clarified Jaggery',
  },
  {
    label: '⚪ Sesame / Til Patti',
    url: 'https://res.cloudinary.com/k84w0prr/image/upload/v1788266818/sesame%20laddu.png',
    badge: '⭐ Customer Favorite',
    title: 'Sesame Chikki (Til Patti)',
    subtitle: 'Toasted White Sesame & Jaggery Energy Crunch',
  },
  {
    label: '🌱 Roasted Flaxseed Laddu',
    url: '/images/flaxseed-laddu.jpg',
    badge: '🌱 Superfood Power',
    title: 'Roasted Flaxseed Jaggery Laddu',
    subtitle: 'Omega-3 Superfood Snack with Roasted Flax & Desi Jaggery',
  },
  {
    label: '🌰 Royal Dry Fruit Crunch',
    url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?q=80&w=800&auto=format&fit=crop',
    badge: '👑 Royal Luxury',
    title: 'Dry Fruit Royal Crunch Chikki',
    subtitle: 'Almonds, Cashews, Pistachios with Dark Palm Jaggery',
  },
  {
    label: '🥥 Coconut Jaggery Delight',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    badge: '🥥 Coastal Favorite',
    title: 'Coconut Jaggery Delight (Thengai Mittai)',
    subtitle: 'Sun-Dried Coastal Coconut with Caramelized Jaggery',
  },
  {
    label: '🎁 Festive Grand Hamper',
    url: 'https://images.unsplash.com/photo-1546554137-f86b9593a222?q=80&w=800&auto=format&fit=crop',
    badge: '🎁 Festive Collection',
    title: 'Vinayaka Heritage Gift Hamper',
    subtitle: 'Assorted 4-Flavor Collection in Traditional Brass Box',
  },
];

export const HeroSettingsEditor = ({ currentSettings, onSaveSettings }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({ ...DEFAULT_HERO_SETTINGS, ...currentSettings });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentSettings) {
      setFormData({ ...DEFAULT_HERO_SETTINGS, ...currentSettings });
    }
  }, [currentSettings]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({
      ...prev,
      heroImage: preset.url,
      heroBadge: preset.badge,
      heroTitle: preset.title,
      heroSubtitle: preset.subtitle,
    }));
    addToast(`Applied preset: ${preset.label}`, 'info');
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset hero photo and main text back to default?')) {
      setFormData(DEFAULT_HERO_SETTINGS);
      addToast('Reset to default values', 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      addToast('✅ Homepage Hero Banner updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update hero banner', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      <div className="p-4 bg-gradient-to-r from-jaggery-100 to-amber-50 rounded-2xl border border-jaggery-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm flex-shrink-0">
            🖼️
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-espresso">
              Homepage Main Hero Photo & Headline Editor
            </h3>
            <p className="text-xs text-espresso-muted">
              Customize the feature photo beside the main headline, badges, overlay text, and values.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetToDefaults}
          className="px-3 py-1.5 rounded-xl bg-white hover:bg-jaggery-50 text-espresso text-xs font-semibold border border-oat-border shadow-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-espresso-muted" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-oat-border shadow-soft space-y-5">
          
          {/* Section 1: Main Photo Beside Context */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-oat-border pb-2">
              <h4 className="font-heading font-bold text-sm text-espresso flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                <span>1. Main Photo Beside Main Context</span>
              </h4>
              <span className="text-[11px] font-semibold text-secondary">Feature Spotlight</span>
            </div>

            {/* Quick Presets Carousel */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1.5">
                Quick Select Photo Preset:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_HERO_PHOTOS.map((preset, idx) => {
                  const isSelected = formData.heroImage === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-xl text-left border transition-all text-xs font-medium flex items-center gap-2 ${
                        isSelected
                          ? 'bg-primary text-white border-primary shadow-sm'
                          : 'bg-oat hover:bg-jaggery-50 text-espresso border-oat-border'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                      <span className="truncate text-[11px] font-semibold leading-tight">{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Image URL */}
            <div>
              <label className="block text-xs font-bold text-espresso mb-1">
                Custom Image URL or Local Path:
              </label>
              <input
                type="text"
                placeholder="https://... or /images/..."
                value={formData.heroImage}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm text-espresso focus:bg-white focus:border-primary outline-none"
              />
              <p className="text-[10px] text-espresso-muted mt-1">
                Paste any Cloudinary link, external image URL, or local asset like <code>/images/flaxseed-laddu.jpg</code>.
              </p>
            </div>

            {/* Overlay Title & Subtitle on Image */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">
                  Tag Badge on Image:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Signature Specialty"
                  value={formData.heroBadge}
                  onChange={(e) => handleChange('heroBadge', e.target.value)}
                  className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso mb-1">
                  Title on Image Overlay:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Homemade Peanut & Jaggery Chikki"
                  value={formData.heroTitle}
                  onChange={(e) => handleChange('heroTitle', e.target.value)}
                  className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso mb-1">
                Subtitle on Image Overlay:
              </label>
              <input
                type="text"
                placeholder="e.g. AAA Saurashtra Peanuts + Pure Clarified Jaggery"
                value={formData.heroSubtitle}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
              />
            </div>

            {/* Floating Badges Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-oat-border">
              {/* Badge 1 */}
              <div className="p-3 bg-oat/60 rounded-2xl border border-oat-border space-y-2">
                <span className="text-[11px] font-bold text-secondary uppercase block">Floating Badge 1 (Top Left)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    title="Emoji Icon"
                    placeholder="🍯"
                    value={formData.heroFloating1Emoji}
                    onChange={(e) => handleChange('heroFloating1Emoji', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-oat-border rounded-lg text-xs text-center outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.heroFloating1Title}
                    onChange={(e) => handleChange('heroFloating1Title', e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Sub text (e.g. Zero White Sugar)"
                  value={formData.heroFloating1Sub}
                  onChange={(e) => handleChange('heroFloating1Sub', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs outline-none"
                />
              </div>

              {/* Badge 2 */}
              <div className="p-3 bg-oat/60 rounded-2xl border border-oat-border space-y-2">
                <span className="text-[11px] font-bold text-secondary uppercase block">Floating Badge 2 (Right)</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    title="Emoji Icon"
                    placeholder="✨"
                    value={formData.heroFloating2Emoji}
                    onChange={(e) => handleChange('heroFloating2Emoji', e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-oat-border rounded-lg text-xs text-center outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Title"
                    value={formData.heroFloating2Title}
                    onChange={(e) => handleChange('heroFloating2Title', e.target.value)}
                    className="col-span-2 px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Sub text (e.g. Fresh Batch)"
                  value={formData.heroFloating2Sub}
                  onChange={(e) => handleChange('heroFloating2Sub', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-lg text-xs outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Main Context (Headline & Text) */}
          <div className="space-y-3 pt-3 border-t border-oat-border">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-sm text-espresso flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>2. Main Context & Headline Text</span>
              </h4>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso mb-1">
                Top Status Pill Text:
              </label>
              <input
                type="text"
                value={formData.topPillText}
                onChange={(e) => handleChange('topPillText', e.target.value)}
                className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-espresso mb-1">
                  Primary Headline:
                </label>
                <input
                  type="text"
                  value={formData.mainHeadline}
                  onChange={(e) => handleChange('mainHeadline', e.target.value)}
                  className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-espresso mb-1">
                  Subheadline Gradient Text:
                </label>
                <input
                  type="text"
                  value={formData.mainSubheadline}
                  onChange={(e) => handleChange('mainSubheadline', e.target.value)}
                  className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso mb-1">
                Main Story Description Paragraph:
              </label>
              <textarea
                rows={3}
                value={formData.mainDescription}
                onChange={(e) => handleChange('mainDescription', e.target.value)}
                className="w-full px-3.5 py-2 bg-oat border border-oat-border rounded-xl text-xs text-espresso focus:bg-white focus:border-primary outline-none"
              />
            </div>
          </div>

          {/* Action Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-white font-heading font-extrabold text-sm shadow-elevated hover:shadow-glow transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Hero Banner Changes'}</span>
            </button>
          </div>

        </div>

        {/* Right Live Preview Card (5 Cols) */}
        <div className="lg:col-span-5 space-y-3 sticky top-24">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-espresso uppercase tracking-wider">Live Real-time Preview:</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Synchronized</span>
          </div>

          <div className="p-3 bg-white rounded-3xl border border-oat-border shadow-elevated space-y-3">
            
            {/* Visual Photo Card */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-jaggery-100 shadow-md">
              <img
                src={formData.heroImage || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=800&auto=format&fit=crop'}
                alt={formData.heroTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent"></div>

              {/* Floating Badge 1 Preview */}
              {formData.heroFloating1Title && (
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-primary/20 flex items-center gap-1.5 scale-90 origin-top-left">
                  <div className="w-6 h-6 rounded-full bg-jaggery-100 flex items-center justify-center text-xs">
                    {formData.heroFloating1Emoji || '🍯'}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-espresso leading-none">{formData.heroFloating1Title}</p>
                    <p className="text-[8px] text-espresso-muted mt-0.5">{formData.heroFloating1Sub}</p>
                  </div>
                </div>
              )}

              {/* Floating Badge 2 Preview */}
              {formData.heroFloating2Title && (
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md border border-secondary/20 flex items-center gap-1.5 scale-90 origin-top-right">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">
                    {formData.heroFloating2Emoji || '✨'}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-espresso leading-none">{formData.heroFloating2Title}</p>
                    <p className="text-[8px] text-espresso-muted mt-0.5">{formData.heroFloating2Sub}</p>
                  </div>
                </div>
              )}

              {/* Overlay Text Preview */}
              <div className="absolute bottom-3 left-3 right-3 p-2.5 bg-espresso/85 backdrop-blur-sm rounded-xl text-white space-y-0.5 border border-white/10">
                {formData.heroBadge && (
                  <span className="inline-block px-2 py-0.5 rounded bg-primary text-white text-[9px] font-bold uppercase tracking-wider">
                    {formData.heroBadge}
                  </span>
                )}
                <h4 className="text-sm font-heading font-bold text-white line-clamp-1">
                  {formData.heroTitle}
                </h4>
                <p className="text-[10px] text-white/90 line-clamp-1">
                  {formData.heroSubtitle}
                </p>
              </div>
            </div>

            {/* Context Headline Preview */}
            <div className="p-3 bg-oat rounded-2xl border border-oat-border space-y-1">
              <span className="text-[10px] font-bold text-secondary block">{formData.topPillText}</span>
              <h5 className="font-heading font-bold text-sm text-espresso leading-tight">{formData.mainHeadline}</h5>
              <p className="text-xs font-bold text-primary">{formData.mainSubheadline}</p>
              <p className="text-[11px] text-espresso/70 line-clamp-2 leading-relaxed mt-1">
                {formData.mainDescription}
              </p>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
