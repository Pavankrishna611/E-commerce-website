import React from 'react';
import { ShieldCheck, Flame, Heart, Sparkles, Truck, CheckCircle2 } from 'lucide-react';

export const TrustBadgesBanner = () => {
  const guarantees = [
    {
      icon: <span className="text-2xl">🍯</span>,
      title: '100% Pure Desi Jaggery',
      description: 'Zero refined white sugar or liquid glucose syrup.',
    },
    {
      icon: <span className="text-2xl">🥜</span>,
      title: 'AAA Grade Slow-Roasted Nuts',
      description: 'Hand-sorted native groundnuts toasted in brass kadhais.',
    },
    {
      icon: <span className="text-2xl">💪</span>,
      title: 'High Protein & Rich in Iron',
      description: 'Guilt-free traditional superfood for the whole family.',
    },
    {
      icon: <span className="text-2xl">🌿</span>,
      title: 'Zero Chemical Additives',
      description: '100% Vegetarian with zero artificial colors or flavors.',
    },
  ];

  return (
    <section className="py-8 bg-white border-y border-oat-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, index) => (
            <div
              key={index}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-oat/50 border border-oat-border hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm border border-oat-border/80">
                {g.icon}
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-espresso leading-snug">
                  {g.title}
                </h4>
                <p className="text-xs text-espresso/70 mt-0.5 leading-relaxed">
                  {g.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
