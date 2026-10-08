import React, { useState, useEffect } from 'react';
import { X, User, MapPin, Package, Plus, Trash2, CheckCircle2, LogOut, Phone, Mail, Clock, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../services/api';

export const ProfileDashboard = ({ isOpen, onClose }) => {
  const { user, logout, addAddress, deleteAddress, setDefaultAddress } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // orders, addresses, profile
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addrTitle, setAddrTitle] = useState('Home');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('Vijayawada');
  const [addrState, setAddrState] = useState('Andhra Pradesh');
  const [addrPincode, setAddrPincode] = useState('520001');

  useEffect(() => {
    if (isOpen && user) {
      fetchUserOrders();
    }
  }, [isOpen, user]);

  const fetchUserOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (err) {
      console.warn('Could not fetch orders:', err.message);
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleCreateAddress = async (e) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrPincode) {
      addToast('Please fill all required address fields', 'error');
      return;
    }

    const success = await addAddress({
      title: addrTitle,
      street: addrStreet,
      landmark: addrLandmark,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      isDefault: user?.addresses?.length === 0,
    });

    if (success) {
      setShowAddAddress(false);
      setAddrStreet('');
      setAddrLandmark('');
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative max-h-[92vh] flex flex-col">
        
        {/* Profile Header */}
        <div className="p-6 bg-gradient-to-r from-espresso via-secondary to-primary text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl font-bold font-heading text-white border border-white/20">
              {user.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">{user.name}</h3>
              <p className="text-xs text-white/80">{user.email} • {user.phone || 'No phone'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-oat-border bg-oat px-6 pt-3 gap-6 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'orders' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
            {activeTab === 'orders' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'addresses' ? 'text-primary font-bold' : 'text-espresso/60 hover:text-espresso'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({user.addresses?.length || 0})</span>
            {activeTab === 'addresses' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>}
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {loadingOrders ? (
                <div className="text-center py-12 text-xs text-espresso-muted">
                  Loading your orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="text-3xl">📦</div>
                  <h4 className="font-heading font-bold text-sm text-espresso">No orders placed yet</h4>
                  <p className="text-xs text-espresso-muted">Your freshly made chikki orders will show up here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id || order.orderNumber}
                    className="p-4 bg-oat rounded-2xl border border-oat-border space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs border-b border-oat-border pb-2">
                      <div>
                        <span className="font-bold text-espresso">Order #{order.orderNumber}</span>
                        <span className="text-espresso-muted ml-2">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {order.orderStatus || 'Placed'}
                      </span>
                    </div>

                    {/* Ordered Items */}
                    <div className="space-y-1 text-xs text-espresso/80">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span>{it.quantity} × {it.title} ({it.weight})</span>
                          <span className="font-semibold text-espresso">₹{it.totalPrice}</span>
                        </div>
                      ))}
                    </div>

                    {/* Address & Total */}
                    <div className="pt-2 border-t border-oat-border flex items-center justify-between text-xs">
                      <div className="text-espresso-muted truncate max-w-[280px]">
                        📍 {order.deliveryAddress?.street}, {order.deliveryAddress?.city}
                      </div>
                      <div className="font-heading font-bold text-primary text-sm">
                        Total: ₹{order.grandTotal}
                      </div>
                    </div>

                    {/* Re-Open WhatsApp Button */}
                    {order.whatsappRedirectUrl && (
                      <div className="pt-1">
                        <a
                          href={order.whatsappRedirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 font-semibold transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          <span>Track / Message Seller on WhatsApp</span>
                        </a>
                      </div>
                    )}

                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === 'addresses' && (
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-espresso uppercase tracking-wider">
                  Your Delivery Addresses
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center gap-1 hover:bg-primary-hover transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showAddAddress ? 'Cancel' : 'Add New Address'}</span>
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddress && (
                <form onSubmit={handleCreateAddress} className="p-4 bg-jaggery-50 rounded-2xl border border-jaggery-200 space-y-3">
                  <h5 className="text-xs font-bold text-espresso">Add New Delivery Address</h5>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-espresso mb-1">Address Label</label>
                      <select
                        value={addrTitle}
                        onChange={(e) => setAddrTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-xl text-xs text-espresso"
                      >
                        <option value="Home">Home</option>
                        <option value="Office">Office</option>
                        <option value="Parents">Parents</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-espresso mb-1">Pincode *</label>
                      <input
                        type="text"
                        required
                        placeholder="520001"
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-xl text-xs text-espresso"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-espresso mb-1">Street Address *</label>
                    <input
                      type="text"
                      required
                      placeholder="Flat / House No, Street, Area"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-xl text-xs text-espresso"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-espresso mb-1">Landmark</label>
                      <input
                        type="text"
                        placeholder="Near Temple / Mall"
                        value={addrLandmark}
                        onChange={(e) => setAddrLandmark(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-xl text-xs text-espresso"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-espresso mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addrCity}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-oat-border rounded-xl text-xs text-espresso"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-secondary text-white text-xs font-bold rounded-xl hover:bg-secondary-hover transition-colors"
                  >
                    Save Address
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="space-y-3">
                {user.addresses?.length === 0 ? (
                  <div className="text-center py-8 text-xs text-espresso-muted">
                    No saved addresses. Add one above for instant 1-click WhatsApp checkouts!
                  </div>
                ) : (
                  user.addresses?.map((addr) => (
                    <div
                      key={addr._id}
                      className="p-4 bg-oat rounded-2xl border border-oat-border flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-espresso">{addr.title}</span>
                          {addr.isDefault && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-espresso/80 leading-relaxed">
                          {addr.street} {addr.landmark && `(${addr.landmark})`} <br />
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr._id)}
                            className="text-[11px] text-secondary font-bold hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(addr._id)}
                          className="p-1 text-espresso/40 hover:text-rose-500 rounded transition-colors"
                          title="Delete address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
