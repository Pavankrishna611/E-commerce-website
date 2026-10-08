import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Heart, ShieldCheck, Award, Sparkles } from 'lucide-react';

export const Footer = ({ brandSettings = {}, onNavigate, onOpenAdmin }) => {
  const brandName = brandSettings?.brandName || 'Vinayaka Chikkis';
  const logoType = brandSettings?.brandLogoType || 'emoji';
  const logoImage = brandSettings?.brandLogoImage || '';
  const logoEmoji = brandSettings?.brandLogoEmoji || '🥜';
  const logoInitials = brandSettings?.brandLogoInitials || 'VC';

  return (
    <footer className="bg-espresso text-oat-light pt-16 pb-12 border-t-4 border-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl text-white shadow-md overflow-hidden flex-shrink-0">
                {logoType === 'image' && logoImage ? (
                  <img
                    src={logoImage}
                    alt={brandName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <span>{logoEmoji}</span>
                )}
              </div>
              <span className="font-heading font-bold text-2xl text-white tracking-tight">
                {brandName}
              </span>
            </div>
            <p className="text-sm text-oat/70 leading-relaxed">
              Handcrafted traditional jaggery snacks made with pure organic sugarcane jaggery, AAA-grade slow-roasted groundnuts, and zero artificial preservatives. Taste the authentic sweetness of heritage recipes.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-jaggery-300">
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Vegetarian
              </span>
              <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                No Refined Sugar
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Quick Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-oat/80">
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('products')} 
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Homemade Peanut Chikki
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('products')} 
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Sesame Til Patti
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('products')} 
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Dry Fruit Royal Crunch
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('products')} 
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> Festive Gift Hampers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate && onNavigate('story')} 
                  className="hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  <span>›</span> 35-Year Heritage Story
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Why Choose Us */}
          <div>
            <h4 className="font-heading font-semibold text-lg text-white mb-4">
              Our Purity Guarantee
            </h4>
            <ul className="space-y-2.5 text-sm text-oat/80">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Wood-fire roasted native groundnuts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Clarified organic jaggery rich in natural iron</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Zero liquid glucose, zero bleached sugar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Triple vacuum sealed for 90-day crispness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                <span>Express courier delivery across India</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Kitchen & Direct Contact */}
          <div className="space-y-4">
            <h4 className="font-heading font-semibold text-lg text-white mb-4">
              Artisan Kitchen Contact
            </h4>
            <div className="space-y-3 text-sm text-oat/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span>Sri Vinayaka Traditional Sweets, Godavari Road, Vijayawada, Andhra Pradesh - 520001</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span>+91 99498 46972</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span>orders@vinayakachikkis.com</span>
              </div>
            </div>

            {/* Direct WhatsApp Action Button */}
            <a
              href="https://wa.me/919949846972?text=Hello%20Vinayaka%20Chikkis,%20I%20want%20to%20order%20chikkis."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Direct WhatsApp Orders</span>
            </a>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-oat/60 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Vinayaka Chikkis. All rights reserved. Handcrafted with love & pure jaggery.</p>
          <div className="flex items-center gap-4 text-jaggery-200">
            <span>FSSAI Certified: 10123000000000</span>
            <span>•</span>
            <span>100% Homemade</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
