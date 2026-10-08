import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Menu, X, Phone, Heart, Sparkles, MessageCircle, Lock, ShieldCheck, ChevronDown, ChevronRight, Home, Package, LogOut } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Header = ({ brandSettings = {}, onOpenAuth, onOpenProfile, onOpenAdmin, onNavigate }) => {
  const { totalItemCount, setIsDrawerOpen, grandTotal } = useCart();
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const brandName = brandSettings?.brandName || 'Vinayaka Chikkis';
  const brandSubtitle = brandSettings?.brandSubtitle || 'Traditional Jaggery Delights';
  const brandTagline = brandSettings?.brandTagline || 'Homemade';
  const logoType = brandSettings?.brandLogoType || 'emoji';
  const logoImage = brandSettings?.brandLogoImage || '';
  const logoEmoji = brandSettings?.brandLogoEmoji || '🥜';
  const logoInitials = brandSettings?.brandLogoInitials || 'VC';

  const handleNavClick = (sectionId) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const displayName = isAdmin 
    ? 'Admin (Owner)' 
    : (user?.name || (user?.phone ? `+91 ${user.phone}` : 'Valued Customer'));

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-nav border-b border-oat-border transition-all duration-300 shadow-soft">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6">
          <div className="flex items-center justify-between h-20 gap-2 sm:gap-3 lg:gap-4">
            
            {/* 1. Left: Brand Logo & Title Section */}
            <div 
              onClick={() => handleNavClick('hero')} 
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group select-none flex-shrink-0 min-w-0"
            >
              {/* Logo Emblem */}
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-primary via-secondary to-espresso p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
                <div className="w-full h-full bg-oat rounded-[14px] flex items-center justify-center overflow-hidden">
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
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-lg leading-none">{logoEmoji}</span>
                      <span className="text-[7px] font-heading font-extrabold text-secondary tracking-tighter uppercase">{logoInitials}</span>
                    </div>
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping"></span>
                </div>
              </div>

              {/* Brand Title */}
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-heading font-extrabold text-base sm:text-lg lg:text-xl text-espresso tracking-tight group-hover:text-primary transition-colors leading-tight truncate">
                    {brandName}
                  </span>
                  {brandTagline && (
                    <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-full bg-jaggery-100 text-secondary border border-jaggery-200 uppercase tracking-wider hidden sm:inline-block flex-shrink-0">
                      {brandTagline}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-espresso-muted font-medium leading-tight hidden xl:inline-block whitespace-nowrap">
                  {brandSubtitle}
                </span>
              </div>
            </div>

            {/* 2. Center: Desktop Navigation Option Bar (UNTOUCHED) */}
            <nav className="hidden md:flex items-center justify-center gap-2 lg:gap-3.5 xl:gap-5 font-medium text-xs lg:text-sm text-espresso flex-1 whitespace-nowrap px-1">
              <button
                onClick={() => handleNavClick('hero')}
                className="text-espresso hover:text-primary transition-colors font-semibold py-1.5 px-2 rounded-lg hover:bg-jaggery-50 relative group flex items-center justify-center whitespace-nowrap"
              >
                Home
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>

              <button
                onClick={() => handleNavClick('products')}
                className="text-espresso hover:text-primary transition-colors font-semibold py-1.5 px-2 rounded-lg hover:bg-jaggery-50 relative group flex items-center justify-center whitespace-nowrap"
              >
                Products & Menu
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>

              <button
                onClick={() => handleNavClick('story')}
                className="text-espresso hover:text-primary transition-colors font-semibold py-1.5 px-2 rounded-lg hover:bg-jaggery-50 relative group flex items-center justify-center whitespace-nowrap"
              >
                Our Story
                <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary scale-x-0 transition-transform duration-300 group-hover:scale-x-100"></span>
              </button>

              {/* Cart Option in Navigation Bar */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="text-espresso hover:text-primary transition-colors font-bold py-1.5 px-2.5 rounded-xl bg-jaggery-100/70 hover:bg-jaggery-200 border border-jaggery-200 flex items-center justify-center gap-1.5 whitespace-nowrap"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                <span>Cart</span>
                {totalItemCount > 0 && (
                  <span className="bg-primary text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
                    {totalItemCount}
                  </span>
                )}
              </button>
            </nav>

            {/* 3. Right: Desktop Action Buttons (UNTOUCHED) */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              
              {/* Admin Portal Button (Desktop) */}
              <button
                onClick={onOpenAdmin}
                className="hidden lg:inline-flex items-center justify-center gap-1.5 text-xs font-bold text-secondary bg-jaggery-100 hover:bg-jaggery-200 border border-jaggery-300 px-3 h-10 rounded-xl transition-all shadow-xs whitespace-nowrap"
                title="Store Owner Portal (Edit Prices & Products)"
              >
                <Lock className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                <span>Admin Portal</span>
              </button>

              {/* Direct WhatsApp Quick Chat (Desktop) */}
              <a
                href="https://wa.me/919949846972?text=Hi%20Vinayaka%20Chikkis,%20I%20would%20like%20to%20inquire%20about%20your%20homemade%20chikkis."
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center justify-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 h-10 rounded-xl transition-all shadow-sm whitespace-nowrap"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 flex-shrink-0" />
                <span>Help</span>
              </a>

              {/* User Profile / Logged In Name Button (Desktop) */}
              {isAuthenticated ? (
                <button
                  onClick={onOpenProfile}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 h-10 rounded-xl bg-jaggery-100 hover:bg-jaggery-200 border border-jaggery-300 text-espresso shadow-xs transition-all active:scale-95 group flex-shrink-0"
                  title="View Saved Addresses & Orders"
                >
                  {/* User Avatar Circle */}
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
                    {isAdmin ? '👑' : (user?.name ? user.name.charAt(0).toUpperCase() : '👤')}
                  </div>
                  
                  {/* User Name */}
                  <div className="flex flex-col text-left justify-center leading-tight">
                    <span className="text-[8px] font-bold text-secondary uppercase tracking-wider">
                      {isAdmin ? 'Store Owner' : 'Account'}
                    </span>
                    <span className="font-heading font-bold text-espresso text-xs whitespace-nowrap max-w-[85px] sm:max-w-[110px] truncate group-hover:text-primary transition-colors">
                      {displayName}
                    </span>
                  </div>

                  <ChevronDown className="w-3 h-3 text-espresso/50 group-hover:text-primary transition-colors hidden sm:inline-block flex-shrink-0" />
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="hidden sm:inline-flex items-center justify-center gap-1 px-3 h-10 rounded-xl bg-white border border-oat-border hover:border-primary text-espresso font-semibold text-xs shadow-sm transition-all hover:text-primary hover:bg-jaggery-50 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span>Login</span>
                </button>
              )}

              {/* Quick Cart Action Button */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md hover:shadow-glow transition-all duration-300 transform active:scale-95 flex-shrink-0"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse-subtle">
                    {totalItemCount}
                  </span>
                )}
              </button>

              {/* DEDICATED SEPARATE MENU BUTTON FOR MOBILE ACCESSIBILITY */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 h-10 rounded-xl bg-jaggery-100 hover:bg-jaggery-200 border border-jaggery-300 text-espresso font-bold text-xs transition-all active:scale-95 shadow-xs flex-shrink-0 ml-1"
                aria-label="Open Mobile Menu"
              >
                {mobileMenuOpen ? (
                  <>
                    <X className="w-4 h-4 text-primary" />
                    <span>Close</span>
                  </>
                ) : (
                  <>
                    <Menu className="w-4 h-4 text-primary" />
                    <span>Menu</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* DEDICATED MOBILE MENU DRAWER */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-md border-b-2 border-primary shadow-2xl px-4 py-5 space-y-4 animate-fadeIn max-h-[80vh] overflow-y-auto">
            
            {/* 1. Mobile Account Header Card */}
            {isAuthenticated ? (
              <div className="p-3.5 bg-gradient-to-r from-jaggery-100 to-oat rounded-2xl border border-jaggery-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {isAdmin ? '👑' : (user?.name ? user.name.charAt(0).toUpperCase() : '👤')}
                  </div>
                  <div>
                    <span className="text-[10px] text-secondary font-bold uppercase tracking-wider block">
                      {isAdmin ? 'Store Owner Mode' : 'Logged In Account'}
                    </span>
                    <span className="font-heading font-bold text-espresso text-sm leading-tight block">
                      {displayName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-2.5 py-1.5 bg-white hover:bg-jaggery-50 rounded-lg text-xs font-bold text-primary border border-oat-border shadow-xs"
                >
                  My Profile
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full p-3.5 bg-gradient-to-r from-jaggery-100 to-amber-50 text-espresso border border-jaggery-300 rounded-2xl font-bold text-xs flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-espresso font-bold">Login / Sign Up</span>
                    <span className="block text-[10px] text-espresso-muted font-medium">Fast 6-digit OTP verification</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-primary" />
              </button>
            )}

            {/* 2. All Navigation Options */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-espresso-muted uppercase tracking-wider px-1 block mb-1">
                Store Navigation
              </span>

              <div className="grid grid-cols-1 gap-1.5">
                
                {/* Option 1: Home */}
                <button
                  onClick={() => handleNavClick('hero')}
                  className="w-full p-3 text-left rounded-xl bg-oat hover:bg-jaggery-100 text-espresso font-semibold transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏠</span>
                    <span className="text-xs sm:text-sm font-bold">Home</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-espresso/40" />
                </button>

                {/* Option 2: Products & Menu */}
                <button
                  onClick={() => handleNavClick('products')}
                  className="w-full p-3 text-left rounded-xl bg-oat hover:bg-jaggery-100 text-espresso font-semibold transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🥜</span>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold">Products & Menu</span>
                      <span className="text-[10px] text-espresso-muted">Peanut, Sesame, Dry Fruit & Seeds</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-espresso/40" />
                </button>

                {/* Option 3: Our Story */}
                <button
                  onClick={() => handleNavClick('story')}
                  className="w-full p-3 text-left rounded-xl bg-oat hover:bg-jaggery-100 text-espresso font-semibold transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📜</span>
                    <div className="flex flex-col">
                      <span className="text-xs sm:text-sm font-bold">Our Heritage & Story</span>
                      <span className="text-[10px] text-espresso-muted">35+ Years traditional family recipe</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-espresso/40" />
                </button>

                {/* Option 4: View Cart */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsDrawerOpen(true);
                  }}
                  className="w-full p-3.5 text-left rounded-2xl bg-primary hover:bg-primary-hover text-white font-bold transition-all flex items-center justify-between shadow-md active:scale-98"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5" />
                    <div>
                      <span className="text-xs sm:text-sm font-bold block">View Cart & Checkout</span>
                      {totalItemCount > 0 ? (
                        <span className="text-[10px] text-white/90">Total: ₹{grandTotal}</span>
                      ) : (
                        <span className="text-[10px] text-white/80">0 items in your cart</span>
                      )}
                    </div>
                  </div>
                  <span className="bg-white text-primary text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs">
                    {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}
                  </span>
                </button>

              </div>
            </div>

            {/* 3. Support & Admin */}
            <div className="pt-2 border-t border-oat-border space-y-2">
              <span className="text-[11px] font-bold text-espresso-muted uppercase tracking-wider px-1 block mb-1">
                Store Support & Admin
              </span>

              <div className="grid grid-cols-2 gap-2">
                
                {/* Admin Portal Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdmin();
                  }}
                  className="flex items-center justify-center gap-1.5 p-3 bg-jaggery-100 hover:bg-jaggery-200 text-secondary border border-jaggery-300 rounded-xl font-bold text-xs transition-colors shadow-xs"
                >
                  <Lock className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span>Admin Portal</span>
                </button>

                {/* Direct WhatsApp Helpline */}
                <a
                  href="https://wa.me/919949846972?text=Hi%20Vinayaka%20Chikkis,%20I%20would%20like%20to%20order%20homemade%20chikkis."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs text-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp Help</span>
                </a>

              </div>

              {/* Logout Button (if authenticated) */}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 py-2 text-center text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout Account</span>
                </button>
              )}

            </div>

          </div>
        )}
      </header>

      {/* 4. MOBILE STICKY BOTTOM QUICK-ACTION MENU BAR (Always accessible for mobile customers) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-oat-border shadow-2xl py-1.5 px-3 flex items-center justify-around">
        
        {/* Home */}
        <button
          onClick={() => handleNavClick('hero')}
          className="flex flex-col items-center justify-center py-1 px-2 text-espresso/70 hover:text-primary active:text-primary transition-colors"
        >
          <Home className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        {/* Products Menu */}
        <button
          onClick={() => handleNavClick('products')}
          className="flex flex-col items-center justify-center py-1 px-2 text-espresso/70 hover:text-primary active:text-primary transition-colors"
        >
          <Package className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>

        {/* Cart Button with Live Counter Badge */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-3 text-primary font-bold"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-4 h-4" />
            </div>
            {totalItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {totalItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-extrabold text-primary mt-0.5">Cart</span>
        </button>

        {/* WhatsApp Quick Link */}
        <a
          href="https://wa.me/919949846972?text=Hi%20Vinayaka%20Chikkis,%20I%20would%20like%20to%20order%20fresh%20homemade%20chikkis."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-1 px-2 text-emerald-600 hover:text-emerald-700 active:text-emerald-800 transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span className="text-[10px] font-semibold mt-0.5">WhatsApp</span>
        </a>

        {/* All Options / Menu Trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex flex-col items-center justify-center py-1 px-2 text-espresso/70 hover:text-primary active:text-primary transition-colors"
        >
          <Menu className="w-4 h-4" />
          <span className="text-[10px] font-semibold mt-0.5">Menu</span>
        </button>

      </div>
    </>
  );
};
