import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, MessageCircle, Flame, CheckCircle2 } from 'lucide-react';
import { DEFAULT_HERO_SETTINGS } from '../../data/heroSettings';

export const HeroSection = ({ onShopNow, settings = {} }) => {
  const current = { ...DEFAULT_HERO_SETTINGS, ...settings };

  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-14 lg:pt-12 lg:pb-20">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary/10 rounded-full blur-2xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
          
          {/* Left Hero Content Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-left">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-jaggery-100/90 border border-jaggery-300 text-secondary text-xs sm:text-sm font-bold shadow-xs">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="line-clamp-1">{current.topPillText}</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-espresso tracking-tight leading-tight">
                {current.mainHeadline}
              </h1>
              <div className="pt-0.5 sm:pt-1">
                <span className="inline-block text-xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-normal py-1">
                  {current.mainSubheadline}
                </span>
              </div>
            </div>

            {/* Value Proposition Description */}
            <p className="text-xs sm:text-base lg:text-lg text-espresso/80 font-normal leading-relaxed max-w-2xl">
              {current.mainDescription}
            </p>

            {/* Clean Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
              <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-oat-border text-xs font-semibold text-espresso shadow-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="truncate">100% Vegetarian</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-oat-border text-xs font-semibold text-espresso shadow-xs">
                <Award className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="truncate">High Protein & Iron</span>
              </div>
              <div className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white border border-oat-border text-xs font-semibold text-espresso shadow-xs col-span-2 sm:col-span-1">
                <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="truncate">Zero Refined Sugar</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-1 sm:pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-heading font-bold text-sm sm:text-base shadow-elevated hover:shadow-glow transition-all duration-300 transform active:scale-95 group"
              >
                <span>Order Fresh Chikkis</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/919949846972?text=Hi%20Vinayaka%20Chikkis,%20I%20would%20like%20to%20place%20an%20order%20for%20fresh%20homemade%20chikkis."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 font-heading font-semibold text-sm sm:text-base border-2 border-emerald-600/30 hover:border-emerald-600 shadow-sm transition-all duration-300 transform active:scale-95"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 fill-emerald-600 flex-shrink-0" />
                <span>WhatsApp Order (9949846972)</span>
              </a>
            </div>

          </div>

          {/* Right Hero Visual Card (5 Cols) - Customizable from Admin */}
          <div className="lg:col-span-5 relative">
            
            {/* Main Product Feature Frame */}
            <div className="relative rounded-3xl bg-white p-2.5 sm:p-3 shadow-elevated border border-oat-border overflow-hidden group">
              <div className="relative h-72 sm:h-80 md:h-[380px] rounded-2xl overflow-hidden bg-jaggery-100">
                <img
                  src={current.heroImage}
                  alt={current.heroTitle}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/30 to-transparent"></div>

                {/* Bottom Overlay Info on Image */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-2.5 sm:p-3 bg-espresso/80 backdrop-blur-sm rounded-xl text-white space-y-0.5 border border-white/10">
                  {current.heroBadge && (
                    <span className="inline-block px-2 py-0.5 rounded bg-primary text-white text-[9px] font-bold uppercase tracking-wider">
                      {current.heroBadge}
                    </span>
                  )}
                  <h3 className="text-sm sm:text-base lg:text-lg font-heading font-bold text-white drop-shadow-sm line-clamp-1">
                    {current.heroTitle}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-white/90 line-clamp-1">
                    {current.heroSubtitle}
                  </p>
                </div>
              </div>

              {/* Floating Badge 1 (Top Left) */}
              {current.heroFloating1Title && (
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg border border-primary/20 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-jaggery-100 flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                    {current.heroFloating1Emoji || '🍯'}
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-espresso leading-none">{current.heroFloating1Title}</p>
                    <p className="text-[8px] sm:text-[9px] text-espresso-muted font-medium mt-0.5">{current.heroFloating1Sub}</p>
                  </div>
                </div>
              )}

              {/* Floating Badge 2 (Top Right on Mobile, bottom right on desktop) */}
              {current.heroFloating2Title && (
                <div className="absolute top-4 right-4 sm:bottom-24 sm:right-6 sm:top-auto bg-white/95 backdrop-blur-md px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg border border-secondary/20 flex items-center gap-1.5 sm:gap-2">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs sm:text-sm">
                    {current.heroFloating2Emoji || '✨'}
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-espresso leading-none">{current.heroFloating2Title}</p>
                    <p className="text-[8px] sm:text-[9px] text-espresso-muted font-medium mt-0.5">{current.heroFloating2Sub}</p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
