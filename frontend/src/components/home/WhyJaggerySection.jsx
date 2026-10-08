import React from 'react';
import { Check, X, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export const WhyJaggerySection = () => {
  return (
    <section id="why-jaggery" className="py-12 sm:py-20 bg-white border-b border-oat-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jaggery-100 text-secondary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            The Purity Difference
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-espresso tracking-tight">
            Why Our Traditional Jaggery is Superior
          </h2>
          <p className="text-xs sm:text-base text-espresso/70 leading-relaxed max-w-2xl mx-auto">
            Most commercial market chikkis use refined white sugar, high-fructose corn syrup, and liquid glucose. Here is why Vinayaka Chikkis are fundamentally different.
          </p>
        </div>

        {/* Side-by-Side Comparison Table / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
          
          {/* Card 1: Vinayaka Organic Jaggery (Highlight) */}
          <div className="p-5 sm:p-8 rounded-3xl bg-gradient-to-b from-jaggery-50 to-white border-2 border-primary shadow-elevated relative flex flex-col justify-between pt-7 sm:pt-9">
            
            {/* Vinayaka Handcrafted Standards Badge (Centered & properly cleared) */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[11px] sm:text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md whitespace-nowrap z-10">
              👑 Vinayaka Handcrafted Standards
            </div>

            <div className="space-y-5 sm:space-y-6 pt-1">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary text-white flex items-center justify-center text-xl sm:text-2xl font-bold flex-shrink-0 shadow-sm">
                  🍯
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-espresso">
                    100% Desi Sugarcane Jaggery
                  </h3>
                  <p className="text-xs text-secondary font-semibold">Unrefined & Mineral Dense</p>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-espresso font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Naturally Rich in Iron & Minerals:</strong> Promotes healthy hemoglobin and stamina.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Zero Chemical Clarification:</strong> No sulfur, no artificial bleaching agents.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Slow, Sustained Energy Release:</strong> Complex unrefined carbs prevent sudden insulin spikes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Warm Caramel Flavor:</strong> Authentic, aromatic earthy sweetness passed down for generations.</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-jaggery-200 text-center">
              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl inline-block">
                ✓ Approved by Pediatricians & Health-Conscious Mothers
              </span>
            </div>
          </div>

          {/* Card 2: Commercial Factory Chikkis */}
          <div className="p-5 sm:p-8 rounded-3xl bg-oat/60 border border-oat-border flex flex-col justify-between opacity-85">
            <div className="space-y-5 sm:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gray-200 text-gray-600 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                  🏭
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg sm:text-xl text-espresso/80">
                    Commercial Factory Chikkis
                  </h3>
                  <p className="text-xs text-rose-600 font-semibold">Refined & Chemically Processed</p>
                </div>
              </div>

              <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm text-espresso/70 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>High-Fructose Liquid Glucose:</strong> Diluted with cheap corn syrup fillers.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Bleached with Sulfur:</strong> Chemical processing strips away all natural minerals.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Sharp Blood Sugar Spikes:</strong> High glycemic index causes rapid crashes.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 font-bold" />
                  </div>
                  <span><strong>Artificial Flavors & Preservatives:</strong> Added to mask stale oil and low-grade nuts.</span>
                </li>
              </ul>
            </div>

            <div className="mt-5 sm:mt-6 pt-3.5 border-t border-oat-border text-center">
              <span className="text-[11px] sm:text-xs font-semibold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-xl inline-block">
                ⚠️ Empty Calories & Highly Refined Sugars
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
