import React from 'react';
import { CheckCircle2, Quote, Sparkles } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Ananya S. Sharma',
      location: 'Hyderabad, Telangana',
      product: 'Homemade Peanut Chikki (1kg Pack)',
      review: '“The peanut chikki reminds me of the traditional Kadalaimittai my grandfather used to buy from the village fair. Incredible crispness, non-sticky, and you can truly taste the aroma of authentic jaggery and cardamom!”',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Dr. Venkat Rao K.',
      location: 'Vijayawada, AP',
      product: 'Sesame Til Patti (500g)',
      review: '“As a physician, I frequently recommend jaggery-sesame snacks to elderly patients and growing children for bone health and natural iron. Vinayaka Chikkis has the purest quality in South India with zero corn syrup.”',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    },
    {
      name: 'Priyanka Deshmukh',
      location: 'Bengaluru, Karnataka',
      product: 'Dry Fruit Royal Crunch & Festive Hamper',
      review: '“Ordered 15 festive hampers for Diwali corporate gifting via their WhatsApp checkout. Seamless ordering experience, received timely updates, and every recipient called to praise the delicious quality!”',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="reviews" className="py-16 bg-white border-b border-oat-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jaggery-100 text-secondary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Verified Customer Stories
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-espresso tracking-tight">
            Loved by Over 15,000+ Families Across India
          </h2>
          <p className="text-sm sm:text-base text-espresso/70 leading-relaxed">
            Read genuine feedback from snack lovers who switched from commercial sugary candy to pure traditional jaggery chikkis.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-oat rounded-3xl p-6 border border-oat-border hover:border-primary/40 shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Quote Icon */}
                <div className="flex items-center justify-between">
                  <Quote className="w-6 h-6 text-primary/40" />
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified Purchase</span>
                </div>

                {/* Review text */}
                <p className="text-xs sm:text-sm text-espresso/80 leading-relaxed italic">
                  {t.review}
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-oat-border/80 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div>
                  <div className="font-heading font-bold text-xs sm:text-sm text-espresso flex items-center gap-1">
                    {t.name}
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" title="Verified Buyer" />
                  </div>
                  <p className="text-[11px] text-espresso-muted">{t.location}</p>
                  <p className="text-[10px] text-secondary font-semibold">{t.product}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
