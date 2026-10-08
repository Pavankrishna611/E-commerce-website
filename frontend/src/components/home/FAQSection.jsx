import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'How does the direct WhatsApp checkout work?',
      a: 'When you build your snack cart and click "Order via WhatsApp", our website automatically compiles an itemized summary (selected weights, quantities, delivery address, promo discounts, and final total). It opens WhatsApp with this pre-filled message directly to our kitchen team so you can confirm and pay conveniently via Google Pay, PhonePe, UPI, or Cash on Delivery!',
    },
    {
      q: 'What is the shelf life of Vinayaka Chikkis?',
      a: 'Our chikkis remain exceptionally crisp for up to 90 days from the packaging date at standard room temperature. We do not use chemical preservatives; our secret lies in precise low-moisture caramelization and immediate vacuum sealing in food-grade pouches.',
    },
    {
      q: 'Is there any refined white sugar, glucose syrup, or sulfur used?',
      a: 'Absolutely none! We use 100% native unrefined sugarcane and palm jaggery. There is zero liquid glucose, zero artificial caramel flavoring, and zero sulfur bleaching.',
    },
    {
      q: 'Can I select different weights for different chikkis in one single order?',
      a: 'Yes! You can choose 250g, 500g, 1kg, or family gift packs for each individual chikki. The price and savings dynamically update before you add to cart or checkout on WhatsApp.',
    },
    {
      q: 'Do you ship across India and provide bulk corporate / wedding orders?',
      a: 'Yes, we dispatch fresh batches daily via express couriers to all serviceable pincodes in India. For wedding favors, festive hampers, or corporate gifts above 10kg, reach out to us directly on WhatsApp for special wholesale pricing.',
    },
  ];

  return (
    <section className="py-16 bg-oat">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-jaggery-100 text-secondary text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-espresso tracking-tight">
            Everything You Need to Know
          </h2>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-oat-border overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-sm sm:text-base text-espresso hover:text-primary transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-espresso/75 leading-relaxed border-t border-oat-border/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
