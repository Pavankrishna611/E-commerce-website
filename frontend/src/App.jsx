import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/layout/AnnouncementBar';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrustBadgesBanner } from './components/home/TrustBadgesBanner';
import { ProductGrid } from './components/products/ProductGrid';
import { WhyJaggerySection } from './components/home/WhyJaggerySection';
import { ArtisanalStory } from './components/home/ArtisanalStory';
import { FAQSection } from './components/home/FAQSection';

import { ProductDetailModal } from './components/products/ProductDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthModal } from './components/auth/AuthModal';
import { ProfileDashboard } from './components/profile/ProfileDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

import { api } from './services/api';
import { FALLBACK_PRODUCTS } from './data/fallbackProducts';
import { DEFAULT_HERO_SETTINGS } from './data/heroSettings';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

export function App() {
  const [products, setProducts] = useState(FALLBACK_PRODUCTS);
  const [heroSettings, setHeroSettings] = useState(DEFAULT_HERO_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('store'); // 'store' | 'admin'

  // Modal States
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(null);
  const [completedOrderWhatsAppUrl, setCompletedOrderWhatsAppUrl] = useState('');

  const { setIsDrawerOpen } = useCart();
  const { isAuthenticated } = useAuth();

  const loadData = async () => {
    try {
      const [prodsData, settingsData] = await Promise.all([
        api.getProducts().catch(() => null),
        api.getSettings().catch(() => null),
      ]);
      if (prodsData && prodsData.length > 0) {
        setProducts(prodsData);
      }
      if (settingsData) {
        setHeroSettings(settingsData);
      }
    } catch (err) {
      console.warn('Backend load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('store');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    if (window.location.hash === '#admin') {
      setCurrentView('admin');
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (sectionId) => {
    if (currentView !== 'store') {
      setCurrentView('store');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAuthOrProfile = () => {
    if (isAuthenticated) {
      setIsProfileOpen(true);
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleOrderCompleted = (order, whatsappUrl) => {
    setCompletedOrderData(order);
    setCompletedOrderWhatsAppUrl(whatsappUrl);
  };

  // If in Admin Portal view:
  if (currentView === 'admin') {
    return (
      <>
        <AdminDashboard
          onBackToStore={() => {
            setCurrentView('store');
            window.location.hash = '';
          }}
          onProductsUpdated={loadData}
          onSettingsUpdated={(updated) => setHeroSettings(updated)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-oat text-espresso selection:bg-primary/20 selection:text-secondary pb-16 md:pb-0">
      
      {/* Top Promotional Bar */}
      <AnnouncementBar />

      {/* Main Brand Sticky Header */}
      <Header
        brandSettings={heroSettings}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '#admin';
        }}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        
        {/* 1. Hero Banner with Customizable Photo & Content */}
        <HeroSection
          onShopNow={() => handleNavigate('products')}
          settings={heroSettings}
        />

        {/* 2. Trust Badges Purity Strip */}
        <TrustBadgesBanner />

        {/* 3. Product Catalog with Dynamic Weight Customization */}
        <ProductGrid
          products={products}
          onQuickView={(prod) => setSelectedProductForModal(prod)}
        />

        {/* 4. Why Our Jaggery is Superior to White Sugar */}
        <WhyJaggerySection />

        {/* 5. 35-Year Heritage Story */}
        <ArtisanalStory onShopNow={() => handleNavigate('products')} />

        {/* 6. Frequently Asked Questions */}
        <FAQSection />

      </main>

      {/* Brand Footer */}
      <Footer
        brandSettings={heroSettings}
        onNavigate={handleNavigate}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '#admin';
        }}
      />

      {/* MODALS & DRAWERS */}

      {/* 1. Product Detail / Nutritional Modal */}
      {selectedProductForModal && (
        <ProductDetailModal
          product={selectedProductForModal}
          onClose={() => setSelectedProductForModal(null)}
        />
      )}

      {/* 2. Slide-out Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* 3. WhatsApp Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderCompleted}
      />

      {/* 4. Order Placed Confirmation Modal */}
      {completedOrderData && (
        <OrderSuccessModal
          order={completedOrderData}
          whatsappUrl={completedOrderWhatsAppUrl}
          onClose={() => setCompletedOrderData(null)}
          onTrackOrder={() => setIsProfileOpen(true)}
        />
      )}

      {/* 5. User Authentication Modal (Phone + OTP) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* 6. User Profile & Saved Addresses Dashboard */}
      <ProfileDashboard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

    </div>
  );
}

export default App;
