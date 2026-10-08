import React from 'react';
import { Flame, Sparkles, Award, Heart, CheckCircle2 } from 'lucide-react';

export const ArtisanalStory = ({ onShopNow }) => {
  return (
    <section id="story" className="py-12 sm:py-20 bg-oat relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Visual Gallery (5 cols) */}
          <div className="lg:col-span-5 relative mb-4 sm:mb-8 lg:mb-0">
            <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-oat-border">
              <img
                src="https://images.unsplash.com/photo-1541832676-9b763b0239ab?q=80&w=800&auto=format&fit=crop"
                alt="Artisanal Chikki Making Process"
                className="w-full h-64 sm:h-80 md:h-[380px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white">
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 uppercase tracking-widest">Heritage Since 1989</span>
                <h4 className="font-heading font-bold text-lg sm:text-xl text-white">Godavari Wood-Fire Technique</h4>
              </div>
            </div>

            {/* Experience Emblem Badge (Clean spacing, zero overlap on mobile) */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-6 sm:right-6 bg-white p-3.5 sm:p-4 rounded-2xl shadow-md sm:shadow-xl border border-primary/30 max-w-full sm:max-w-[210px] text-center flex sm:block items-center justify-between sm:justify-center gap-3">
              <div className="text-xl sm:text-2xl font-heading font-black text-primary whitespace-nowrap">35+ Years</div>
              <p className="text-[11px] font-medium text-espresso/80 leading-tight text-left sm:text-center">
                Of Unbroken Family Recipe & Craftsmanship
              </p>
            </div>
          </div>

          {/* Right Story Description (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 pt-2 sm:pt-4 lg:pt-0">
            
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jaggery-100 text-secondary text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Our Sacred Tradition
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-espresso tracking-tight leading-tight">
              From Grandmother’s Brass Kadhai to Your Family Table.
            </h2>

            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm lg:text-base text-espresso/80 leading-relaxed font-normal">
              <p>
                In the quiet, fertile villages of the Godavari delta, our grandmother began roasting local groundnuts over tamarind-wood embers in 1989. Her secret was simple yet uncompromising: <strong>never rush the caramelization of natural sugarcane jaggery.</strong>
              </p>
              <p>
                Today, at <strong>Vinayaka Chikkis</strong>, every batch is prepared with the exact same unhurried artisanal respect. We hand-sort individual peanuts, toast them to an aromatic golden brown in heavy brass cauldrons, and blend them with unrefined, chemical-free jaggery.
              </p>
            </div>

            {/* 3 Step Craftsmanship Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
              <div className="p-3 bg-white rounded-2xl border border-oat-border">
                <div className="text-base sm:text-lg mb-1">🔥</div>
                <h5 className="font-heading font-bold text-xs text-espresso">Wood-Fire Roasting</h5>
                <p className="text-[10px] sm:text-[11px] text-espresso/70 mt-0.5">Even golden crunch without scorched skins.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-oat-border">
                <div className="text-base sm:text-lg mb-1">🍯</div>
                <h5 className="font-heading font-bold text-xs text-espresso">Clarified Jaggery</h5>
                <p className="text-[10px] sm:text-[11px] text-espresso/70 mt-0.5">Slow cooked to soft crack temperature.</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-oat-border">
                <div className="text-base sm:text-lg mb-1">📦</div>
                <h5 className="font-heading font-bold text-xs text-espresso">Vacuum Fresh</h5>
                <p className="text-[10px] sm:text-[11px] text-espresso/70 mt-0.5">Locked in airtight seals within 2 hours.</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onShopNow}
                className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95 text-center"
              >
                Taste the Tradition Today
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
