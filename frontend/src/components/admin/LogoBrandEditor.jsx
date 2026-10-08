import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Sparkles, RefreshCw, Wand2, ShieldCheck, Check, Type, Eye } from 'lucide-react';
import { DEFAULT_HERO_SETTINGS } from '../../data/heroSettings';
import { useToast } from '../../context/ToastContext';

const LOGO_PRESETS = [
  {
    label: '🥜 Peanut Classic',
    type: 'emoji',
    emoji: '🥜',
    initials: 'VC',
    brandName: 'Vinayaka Chikkis',
    brandSubtitle: 'Traditional Jaggery Delights',
    brandTagline: 'Homemade',
    image: '',
  },
  {
    label: '🍯 Pure Jaggery Sweets',
    type: 'emoji',
    emoji: '🍯',
    initials: 'VS',
    brandName: 'Vinayaka Sweets',
    brandSubtitle: 'Authentic Godavari Traditional Sweets',
    brandTagline: 'Pure Desi Ghee',
    image: '',
  },
  {
    label: '🪔 Heritage Brass Kadhai',
    type: 'emoji',
    emoji: '🪔',
    initials: 'VS',
    brandName: 'Sri Vinayaka Sweets & Chikkis',
    brandSubtitle: 'Wood-Fire Roasted Since 1989',
    brandTagline: 'Artisanal',
    image: '',
  },
  {
    label: '👑 Royal Dry Fruit Mithai',
    type: 'emoji',
    emoji: '👑',
    initials: 'VC',
    brandName: 'Vinayaka Artisanal Sweets',
    brandSubtitle: 'Premium Dry Fruit & Jaggery Delights',
    brandTagline: 'Premium',
    image: '',
  },
  {
    label: '🖼️ Custom Graphic Logo',
    type: 'image',
    emoji: '🥜',
    initials: 'VC',
    brandName: 'Vinayaka Sweets & Chikkis',
    brandSubtitle: 'Handcrafted With Love in Andhra Pradesh',
    brandTagline: '100% Natural',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?q=80&w=200&auto=format&fit=crop',
  },
];

export const LogoBrandEditor = ({ currentSettings, onSaveSettings }) => {
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
      brandLogoType: preset.type,
      brandLogoEmoji: preset.emoji,
      brandLogoInitials: preset.initials,
      brandName: preset.brandName,
      brandSubtitle: preset.brandSubtitle,
      brandTagline: preset.brandTagline,
      brandLogoImage: preset.image,
    }));
    addToast(`Applied preset: ${preset.label}`, 'info');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      addToast('✅ Header Logo & Brand details saved successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update brand logo', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Notice */}
      <div className="p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent rounded-3xl border border-amber-300/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 flex items-center justify-center text-secondary text-2xl flex-shrink-0">
            🏷️
          </div>
          <div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-espresso">
              Header Logo & Brand Identity Slot
            </h3>
            <p className="text-xs sm:text-sm text-espresso/70">
              Customize the logo emblem, brand name, subtitle, and badge appearing in the top navigation bar.
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-heading font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2 flex-shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Brand Settings'}</span>
        </button>
      </div>

      {/* Live Header Logo Preview Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-oat-border shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-oat-border pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <h4 className="font-heading font-bold text-sm text-espresso">
              Live Header Navigation Bar Preview
            </h4>
          </div>
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider bg-jaggery-100 px-2 py-0.5 rounded-full border border-jaggery-200">
            Real-time preview
          </span>
        </div>

        {/* Mock Top Navigation Header */}
        <div className="p-4 bg-oat/60 rounded-2xl border border-oat-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            
            {/* Logo Emblem Render */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-espresso p-0.5 shadow-md flex-shrink-0">
              <div className="w-full h-full bg-oat rounded-[14px] flex items-center justify-center overflow-hidden">
                {formData.brandLogoType === 'image' && formData.brandLogoImage ? (
                  <img
                    src={formData.brandLogoImage}
                    alt={formData.brandName || 'Brand Logo'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-lg leading-none">{formData.brandLogoEmoji || '🥜'}</span>
                    <span className="text-[7px] font-heading font-extrabold text-secondary tracking-tighter uppercase">
                      {formData.brandLogoInitials || 'VC'}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping"></span>
              </div>
            </div>

            {/* Brand Title Render */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-base sm:text-lg text-espresso tracking-tight leading-tight">
                  {formData.brandName || 'Vinayaka Chikkis'}
                </span>
                {formData.brandTagline && (
                  <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-jaggery-100 text-secondary border border-jaggery-200 uppercase tracking-wider">
                    {formData.brandTagline}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-espresso-muted font-medium leading-tight">
                {formData.brandSubtitle || 'Traditional Jaggery Delights'}
              </span>
            </div>

          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-espresso-muted">
            <span className="px-2.5 py-1 bg-white rounded-lg border border-oat-border">Home</span>
            <span className="px-2.5 py-1 bg-white rounded-lg border border-oat-border">Products & Menu</span>
            <span className="px-2.5 py-1 bg-jaggery-100 text-secondary rounded-lg border border-jaggery-200 font-bold">🛒 Cart</span>
          </div>
        </div>
      </div>

      {/* Quick 1-Click Presets */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-oat-border shadow-soft space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-bold text-sm text-espresso">
            1-Click Brand Presets
          </h4>
        </div>
        <p className="text-xs text-espresso-muted">
          Quickly switch styles or test different logo variations.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
          {LOGO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className="p-3 rounded-2xl bg-oat/50 hover:bg-jaggery-100/60 border border-oat-border hover:border-primary text-left transition-all group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-white border border-oat-border flex items-center justify-center text-base shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0">
                {preset.type === 'image' ? '🖼️' : preset.emoji}
              </div>
              <div className="min-w-0">
                <div className="font-heading font-bold text-xs text-espresso group-hover:text-primary transition-colors truncate">
                  {preset.label}
                </div>
                <div className="text-[10px] text-espresso-muted truncate">
                  {preset.brandName}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-3xl border border-oat-border shadow-soft space-y-5">
        
        <div className="border-b border-oat-border pb-3 flex items-center justify-between">
          <h4 className="font-heading font-bold text-sm text-espresso">
            Logo & Brand Customization Controls
          </h4>
        </div>

        {/* 1. Logo Style Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-espresso uppercase tracking-wider">
            Logo Display Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleChange('brandLogoType', 'emoji')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formData.brandLogoType === 'emoji' || !formData.brandLogoType
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-oat text-espresso border-oat-border hover:bg-white'
              }`}
            >
              <span>🥜 Artisanal Icon + Initials (Default)</span>
            </button>
            <button
              type="button"
              onClick={() => handleChange('brandLogoType', 'image')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                formData.brandLogoType === 'image'
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-oat text-espresso border-oat-border hover:bg-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>🖼️ Custom Logo Image URL</span>
            </button>
          </div>
        </div>

        {/* 2. Logo Inputs Based on Type */}
        {formData.brandLogoType === 'image' ? (
          <div className="space-y-3 p-4 bg-oat/50 rounded-2xl border border-oat-border">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Custom Logo Image URL (PNG, SVG, JPG, WebP) *
              </label>
              <input
                type="url"
                required={formData.brandLogoType === 'image'}
                placeholder="e.g. https://example.com/vinayaka-logo.png or /images/logo.png"
                value={formData.brandLogoImage || ''}
                onChange={(e) => handleChange('brandLogoImage', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-oat-border rounded-xl text-xs sm:text-sm font-medium text-espresso focus:border-primary outline-none"
              />
              <p className="text-[11px] text-espresso-muted mt-1">
                💡 Tip: Provide a square or transparent PNG/SVG for the best crisp look inside the gold emblem.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-oat/50 rounded-2xl border border-oat-border">
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Logo Main Emoji / Symbol *
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. 🥜 or 🍯 or 🪔"
                value={formData.brandLogoEmoji || '🥜'}
                onChange={(e) => handleChange('brandLogoEmoji', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-oat-border rounded-xl text-center text-xl font-bold text-espresso focus:border-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-espresso mb-1">
                Logo Subtext Initials (1-3 Letters) *
              </label>
              <input
                type="text"
                maxLength={4}
                placeholder="e.g. VC or VS"
                value={formData.brandLogoInitials || 'VC'}
                onChange={(e) => handleChange('brandLogoInitials', e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 bg-white border border-oat-border rounded-xl text-center text-xs font-extrabold uppercase tracking-widest text-secondary focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        {/* 3. Brand Text Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          
          {/* Brand Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-espresso mb-1">
              Store Brand Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vinayaka Chikkis or Vinayaka Sweets"
              value={formData.brandName || ''}
              onChange={(e) => handleChange('brandName', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-bold text-espresso focus:bg-white focus:border-primary outline-none"
            />
          </div>

          {/* Badge Tagline */}
          <div>
            <label className="block text-xs font-bold text-espresso mb-1">
              Badge Pill Text
            </label>
            <input
              type="text"
              placeholder="e.g. Homemade or Artisanal"
              value={formData.brandTagline || ''}
              onChange={(e) => handleChange('brandTagline', e.target.value)}
              className="w-full px-3.5 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none"
            />
          </div>

        </div>

        {/* Subtitle / Tagline */}
        <div>
          <label className="block text-xs font-bold text-espresso mb-1">
            Brand Subtitle / Slogan
          </label>
          <input
            type="text"
            placeholder="e.g. Traditional Jaggery Delights or Authentic Godavari Sweets"
            value={formData.brandSubtitle || ''}
            onChange={(e) => handleChange('brandSubtitle', e.target.value)}
            className="w-full px-3.5 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm text-espresso focus:bg-white focus:border-primary outline-none"
          />
        </div>

        {/* Submit Buttons */}
        <div className="pt-3 border-t border-oat-border flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Brand Logo...' : 'Save & Publish Logo'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
