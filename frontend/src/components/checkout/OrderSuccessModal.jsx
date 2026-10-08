import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, MessageCircle, Copy, Sparkles, X, ArrowRight, Package } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const OrderSuccessModal = ({ order, whatsappUrl, onClose, onTrackOrder }) => {
  const { addToast } = useToast();

  useEffect(() => {
    // Fire festive confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#B45309', '#F59E0B', '#059669'],
      });
    } catch (e) {
      console.log('Confetti effect trigger:', e);
    }
  }, []);

  if (!order) return null;

  const handleCopyMessage = () => {
    if (order.whatsappMessage) {
      navigator.clipboard.writeText(order.whatsappMessage);
      addToast('Order text copied to clipboard!', 'success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-oat-border modal-animate p-6 sm:p-8 space-y-6 text-center relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-espresso/40 hover:text-espresso rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        {/* Header Text */}
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Order Request Created!
          </span>
          <h3 className="font-heading font-extrabold text-2xl text-espresso">
            Thank You, {order.customerDetails?.name?.split(' ')[0]}!
          </h3>
          <p className="text-xs sm:text-sm text-espresso/70">
            Order Reference: <strong className="text-secondary font-mono">{order.orderNumber}</strong>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-oat rounded-2xl p-4 border border-oat-border text-left space-y-3 text-xs">
          <div className="flex justify-between font-bold text-espresso border-b border-oat-border pb-2">
            <span>Ordered Traditional Snacks:</span>
            <span className="text-primary font-extrabold">₹{order.grandTotal}</span>
          </div>

          <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex justify-between text-espresso/80">
                <span>{it.quantity} × {it.title} ({it.weight})</span>
                <span className="font-semibold text-espresso">₹{it.totalPrice}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-oat-border text-espresso/70">
            <strong>Delivery To:</strong> {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-elevated hover:shadow-glow transition-all"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
              <span>Re-open Seller WhatsApp Chat</span>
            </a>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyMessage}
              className="py-2.5 px-3 rounded-xl bg-oat hover:bg-jaggery-100 border border-oat-border text-espresso text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Message</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onTrackOrder) onTrackOrder(order);
              }}
              className="py-2.5 px-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Package className="w-3.5 h-3.5" />
              <span>View in Profile</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
