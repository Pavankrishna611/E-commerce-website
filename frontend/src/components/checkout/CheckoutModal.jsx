import React, { useState, useEffect } from 'react';
import { X, MessageCircle, ShieldCheck, MapPin, User, Phone, FileText, ArrowRight, CheckCircle2, Sparkles, Copy, ExternalLink } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';
import { formatWhatsAppOrderMessage, generateWhatsAppUrl, DEFAULT_SELLER_PHONE } from '../../utils/whatsappHelper';

export const CheckoutModal = ({ isOpen, onClose, onOrderComplete }) => {
  const { items, subtotal, discount, deliveryFee, grandTotal, appliedCoupon, clearCart } = useCart();
  const { user, isAuthenticated, addAddress } = useAuth();
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Vijayawada');
  const [state, setState] = useState('Andhra Pradesh');
  const [pincode, setPincode] = useState('520001');
  const [notes, setNotes] = useState('');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(true);
  const [sellerWhatsApp, setSellerWhatsApp] = useState(DEFAULT_SELLER_PHONE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // details or preview

  // Populate from logged in user
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (defaultAddr) {
        setStreet(defaultAddr.street || '');
        setLandmark(defaultAddr.landmark || '');
        setCity(defaultAddr.city || 'Vijayawada');
        setState(defaultAddr.state || 'Andhra Pradesh');
        setPincode(defaultAddr.pincode || '520001');
      }
    }
  }, [user]);

  if (!isOpen) return null;

  // Live generated formatted WhatsApp message
  const generatedMessage = formatWhatsAppOrderMessage({
    customerDetails: { name, phone, alternatePhone },
    deliveryAddress: { street, landmark, city, state, pincode },
    items,
    subtotal,
    discount,
    deliveryFee,
    grandTotal,
    notes,
  });

  const handleSelectSavedAddress = (addr) => {
    setStreet(addr.street);
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state || 'Andhra Pradesh');
    setPincode(addr.pincode);
    addToast('Filled saved address', 'info');
  };

  const handleOrderViaWhatsApp = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      addToast('Please enter your full name', 'error');
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      addToast('Please enter a valid 10-digit WhatsApp phone number', 'error');
      return;
    }
    if (!street.trim() || !pincode.trim() || !city.trim()) {
      addToast('Please complete your full delivery address and pincode', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Prepare Order Payload for MongoDB Backend
      const orderPayload = {
        customerDetails: {
          name: name.trim(),
          phone: phone.trim(),
          alternatePhone: alternatePhone.trim(),
        },
        deliveryAddress: {
          street: street.trim(),
          landmark: landmark.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: items.map((it) => ({
          product: it.productId,
          title: it.title,
          weight: it.weight,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
          image: it.image,
        })),
        subtotal,
        discount,
        couponCode: appliedCoupon?.code || '',
        deliveryFee,
        grandTotal,
        notes: notes.trim(),
      };

      // 2. Save Address to Profile if checked & authenticated
      if (isAuthenticated && saveAddressToProfile && street && city && pincode) {
        addAddress({
          title: 'Home',
          street,
          landmark,
          city,
          state,
          pincode,
          isDefault: true,
        });
      }

      // 3. Create Order in Backend API
      let orderResult;
      try {
        orderResult = await api.createOrder(orderPayload);
      } catch (err) {
        console.warn('Backend order sync note:', err.message);
        // Create local simulated order if backend is unreachable
        orderResult = {
          success: true,
          order: {
            orderNumber: `VC-${Date.now().toString().slice(-6)}`,
            ...orderPayload,
          },
          whatsappMessage: generatedMessage,
          whatsappRedirectUrl: generateWhatsAppUrl(generatedMessage, sellerWhatsApp),
        };
      }

      // 4. Construct final WhatsApp redirect URL
      const finalWhatsAppUrl = generateWhatsAppUrl(
        orderResult.whatsappMessage || generatedMessage,
        sellerWhatsApp
      );

      // 5. Open WhatsApp in new tab / app
      window.open(finalWhatsAppUrl, '_blank');

      // 6. Complete Order flow
      clearCart();
      onClose();
      if (onOrderComplete) {
        onOrderComplete(orderResult.order, finalWhatsAppUrl);
      }

      addToast('Order generated! Opening WhatsApp...', 'success');
    } catch (error) {
      addToast(error.message || 'Failed to generate WhatsApp order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyMessageToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    addToast('WhatsApp message copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-espresso via-secondary to-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-emerald-300">
              <MessageCircle className="w-6 h-6 fill-emerald-400 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">Direct WhatsApp Checkout</h3>
              <p className="text-xs text-white/80">Instant order placement with traditional sweet artisan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Delivery Form vs Live WhatsApp Preview */}
        <div className="flex border-b border-oat-border bg-oat px-6 pt-3 gap-4 text-xs sm:text-sm font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'details' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
            }`}
          >
            📍 1. Delivery & Contact Details
            {activeTab === 'details' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'preview' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
            }`}
          >
            💬 2. WhatsApp Message Preview
            {activeTab === 'preview' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>
        </div>

        {/* Scrollable Form / Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {activeTab === 'details' ? (
            <form onSubmit={handleOrderViaWhatsApp} className="space-y-5">
              
              {/* Saved Address Selector for Logged In Users */}
              {isAuthenticated && user?.addresses?.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-espresso">Quick Fill from Saved Addresses:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.addresses.map((addr) => (
                      <button
                        key={addr._id}
                        type="button"
                        onClick={() => handleSelectSavedAddress(addr)}
                        className="p-2.5 rounded-xl border border-oat-border bg-oat hover:bg-jaggery-50 text-left text-xs space-y-0.5 transition-colors"
                      >
                        <div className="font-bold text-espresso flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" /> {addr.title} {addr.isDefault && '(Default)'}
                        </div>
                        <p className="text-[11px] text-espresso-muted truncate">{addr.street}, {addr.city}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 1: Customer Info */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Customer Information
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">WhatsApp Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Delivery Address */}
              <div className="space-y-3 pt-2 border-t border-oat-border">
                <h4 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Delivery Address
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-espresso mb-1">House / Flat No., Street, Colony *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 301, Sri Sai Towers, MG Road"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-espresso mb-1">Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="Near Temple / School"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-espresso mb-1">City / Town *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vijayawada"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-espresso mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 520001"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs sm:text-sm text-espresso outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Delivery Notes & Instructions */}
              <div className="space-y-2 pt-2 border-t border-oat-border">
                <label className="block text-xs font-semibold text-espresso">
                  Special Delivery Instructions / Festive Gift Note (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please pack in extra gift wrapping, or leave at reception."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-oat border border-oat-border focus:border-primary focus:bg-white text-xs text-espresso outline-none transition-all resize-none"
                />
              </div>

              {/* Seller WhatsApp Number Config (Editable) */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                <span className="text-espresso font-medium flex items-center gap-1">
                  📞 Order receiving WhatsApp:
                </span>
                <input
                  type="text"
                  value={sellerWhatsApp}
                  onChange={(e) => setSellerWhatsApp(e.target.value)}
                  className="px-2 py-1 bg-white border border-amber-300 rounded-lg text-xs font-mono text-espresso font-bold w-36 text-center"
                  title="Seller WhatsApp Number"
                />
              </div>

              {/* Order Summary Recap Box */}
              <div className="bg-oat p-4 rounded-2xl border border-oat-border space-y-2">
                <div className="text-xs font-bold text-espresso uppercase tracking-wider mb-1">
                  Order Summary ({items.length} snacks)
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 text-xs text-espresso/80 pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between">
                      <span>{it.quantity} × {it.title} ({it.weight})</span>
                      <span className="font-semibold text-espresso">₹{it.totalPrice}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-oat-border flex justify-between items-center text-sm font-bold text-espresso">
                  <span>Payable Total:</span>
                  <span className="text-primary text-base font-extrabold">₹{grandTotal}</span>
                </div>
              </div>

            </form>
          ) : (
            /* Tab 2: WhatsApp Formatted Preview */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-espresso-muted">
                <span>This formatted text will be automatically sent to the seller on WhatsApp:</span>
                <button
                  type="button"
                  onClick={copyMessageToClipboard}
                  className="flex items-center gap-1 text-primary font-bold hover:underline"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Text
                </button>
              </div>

              <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-emerald-300/40 shadow-inner font-mono text-xs text-espresso whitespace-pre-wrap leading-relaxed">
                {generatedMessage}
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>
                  When you click <strong>"Send Order via WhatsApp"</strong>, WhatsApp will launch with this exact itemized text ready to hit send!
                </span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 bg-white border-t border-oat-border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-elevated">
          <div className="text-xs text-espresso-muted hidden sm:block">
            Pay via UPI / GPay / PhonePe / COD on WhatsApp
          </div>

          <button
            onClick={handleOrderViaWhatsApp}
            disabled={isSubmitting || items.length === 0}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-elevated hover:shadow-glow transition-all duration-300 active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>{isSubmitting ? 'Opening WhatsApp...' : `Send Order via WhatsApp (₹${grandTotal})`}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
