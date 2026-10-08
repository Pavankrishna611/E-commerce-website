import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, ShoppingCart, DollarSign, Store, Sparkles, CheckCircle2, Clock, Truck, ShieldCheck, Search, Filter, Lock, User, Eye, EyeOff, ArrowRight, LogOut, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ProductEditorModal } from './ProductEditorModal';
import { HeroSettingsEditor } from './HeroSettingsEditor';
import { LogoBrandEditor } from './LogoBrandEditor';

export const AdminDashboard = ({ onBackToStore, onProductsUpdated, onSettingsUpdated }) => {
  const { addToast } = useToast();
  const { user, isAdmin, loginAdmin, logout, loading: authLoading } = useAuth();

  // Admin Login Credentials State (if not logged in as admin)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Admin Data State
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'hero'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Editor Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [prodsData, ordersData, settingsData] = await Promise.all([
        api.getProducts().catch(() => []),
        api.getAllOrders().catch(() => []),
        api.getSettings().catch(() => null),
      ]);
      setProducts(prodsData || []);
      setOrders(ordersData || []);
      setSettings(settingsData);
    } catch (err) {
      console.warn('Admin data load warning:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminFormLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!adminUsername.trim() || !adminPassword.trim()) {
      setLoginError('Please enter both username and password');
      addToast('Please enter both username and password', 'error');
      return;
    }

    setLoginLoading(true);
    const res = await loginAdmin(adminUsername.trim(), adminPassword.trim());
    setLoginLoading(false);

    if (res.success) {
      setLoginError('');
      await fetchAdminData();
    } else {
      setLoginError(res.error || 'Invalid Admin Username or Password');
    }
  };

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setIsEditorOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setIsEditorOpen(true);
  };

  const handleSaveProduct = async (formData, productId) => {
    try {
      if (productId) {
        await api.updateProduct(productId, formData);
        addToast(`Updated product: ${formData.title}`, 'success');
      } else {
        await api.createProduct(formData);
        addToast(`Added new product: ${formData.title} to store!`, 'success');
      }
      setIsEditorOpen(false);
      await fetchAdminData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      addToast(err.message || 'Failed to save product', 'error');
    }
  };

  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from the store?`)) return;
    try {
      await api.deleteProduct(id);
      addToast(`Removed ${title}`, 'info');
      await fetchAdminData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      addToast(`Order status updated to ${newStatus}`, 'success');
      await fetchAdminData();
    } catch (err) {
      addToast(err.message || 'Failed to update order status', 'error');
    }
  };

  const handleSaveSettings = async (newSettings) => {
    const updated = await api.updateSettings(newSettings);
    setSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
  };

  // Auth Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-oat flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mb-3"></div>
        <p className="text-sm font-heading font-bold text-espresso">Checking Store Owner Session...</p>
      </div>
    );
  }

  // If user is NOT logged in as Admin, show Admin Login Gatekeeper screen
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-oat flex flex-col items-center justify-center p-4 sm:p-6">
        
        {/* Back to store button */}
        <button
          onClick={onBackToStore}
          className="mb-6 px-4 py-2 bg-white hover:bg-jaggery-100 text-espresso text-xs sm:text-sm font-semibold rounded-2xl border border-oat-border shadow-soft flex items-center gap-2 transition-all"
        >
          <Store className="w-4 h-4 text-primary" />
          <span>← Return to Customer Storefront</span>
        </button>

        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-oat-border modal-animate">
          
          {/* Header */}
          <div className="p-8 bg-gradient-to-r from-espresso via-secondary to-primary text-white text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto text-3xl mb-1 shadow-md">
              🔒
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white tracking-tight">
              Vinayaka Admin Portal
            </h2>
            <p className="text-xs text-white/80">
              Authorized Store Owners Only • Login to manage inventory & prices
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminFormLogin} className="p-6 sm:p-8 space-y-4">
            
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2 animate-fadeIn">
                <span>⚠️ {loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-espresso mb-1.5 uppercase tracking-wider">
                Admin Username *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-espresso-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none transition-all"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-espresso mb-1.5 uppercase tracking-wider">
                Admin Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-espresso-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-espresso-muted hover:text-espresso"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Auto-fill Admin Credentials */}
            <button
              type="button"
              onClick={() => {
                setAdminUsername('chikki');
                setAdminPassword('chikki123');
              }}
              className="w-full py-2 bg-amber-100/70 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-xl border border-amber-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>⚡ Auto-fill Credentials (chikki / chikki123)</span>
            </button>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-heading font-extrabold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{loginLoading ? 'Authenticating Admin...' : 'Login to Admin Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-xs text-espresso-muted flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Protected by 256-bit JWT authentication</span>
            </div>

          </form>

        </div>
      </div>
    );
  }

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const activeProductsCount = products.filter((p) => p.weightVariants?.some((v) => v.inStock)).length;

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-oat text-espresso pb-16">
      
      {/* Top Admin Navigation Header */}
      <header className="bg-espresso text-white py-4 px-4 sm:px-8 border-b-4 border-primary shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-xl text-white font-bold shadow-md">
              🥜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-heading font-bold text-xl text-white">Vinayaka Admin Portal</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-espresso uppercase tracking-wider">
                  Store Owner Mode
                </span>
              </div>
              <p className="text-xs text-oat/70">Manage product catalog, edit weight pricing & track customer orders</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end">
            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Store className="w-4 h-4 text-primary" />
              <span>Customer Store</span>
            </button>

            {/* SINGLE DEDICATED ADD PRODUCT BUTTON */}
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-elevated hover:shadow-glow transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>

            {/* SECURE LOGOUT BUTTON */}
            <button
              onClick={() => {
                logout();
                addToast('Logged out of Admin Portal', 'info');
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors border border-rose-400/30"
              title="Securely Logout from Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-oat-border shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-espresso-muted uppercase tracking-wider">Total Products</p>
              <h3 className="text-2xl font-heading font-extrabold text-espresso mt-1">{products.length}</h3>
              <p className="text-[11px] text-secondary font-semibold mt-0.5">{activeProductsCount} In Active Stock</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-primary flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-oat-border shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-espresso-muted uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-heading font-extrabold text-espresso mt-1">{orders.length}</h3>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">WhatsApp Verified</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-oat-border shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-espresso-muted uppercase tracking-wider">Gross Order Value</p>
              <h3 className="text-2xl font-heading font-extrabold text-primary mt-1">₹{totalRevenue}</h3>
              <p className="text-[11px] text-espresso-muted mt-0.5">All time generated</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-jaggery-100 text-secondary flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-oat-border shadow-soft flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-espresso-muted uppercase tracking-wider">Store Status</p>
              <h3 className="text-2xl font-heading font-extrabold text-emerald-700 mt-1">Online 🟢</h3>
              <p className="text-[11px] text-espresso-muted mt-0.5">Ready for WhatsApp orders</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Tab Switcher: Products Catalog vs Logo & Brand vs Hero Banner vs Orders */}
        <div className="flex border-b border-oat-border gap-4 sm:gap-6 text-xs sm:text-sm font-heading font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' ? 'text-primary border-b-2 border-primary' : 'text-espresso-muted hover:text-espresso'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog & Prices ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'brand' ? 'text-primary border-b-2 border-primary' : 'text-espresso-muted hover:text-espresso'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🏷️ Header Logo & Brand</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hero' ? 'text-primary border-b-2 border-primary' : 'text-espresso-muted hover:text-espresso'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Main Hero Photo & Headlines</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 transition-colors relative flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-espresso-muted hover:text-espresso'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-oat-border shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm text-espresso outline-none focus:bg-white focus:border-primary"
                />
              </div>

              <div className="text-xs text-espresso-muted font-medium">
                Showing <strong className="text-espresso">{filteredProducts.length}</strong> of {products.length} items • Click <strong>"Edit Price"</strong> to modify prices & weights
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-oat-border shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-oat border-b border-oat-border text-espresso font-heading font-bold text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-4 px-4 sm:px-6">Product</th>
                      <th className="py-4 px-4">Category</th>
                      <th className="py-4 px-4">Weight Packs & Prices</th>
                      <th className="py-4 px-4">Tags</th>
                      <th className="py-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-oat-border">
                    {filteredProducts.map((prod) => (
                      <tr key={prod._id || prod.slug} className="hover:bg-jaggery-50/50 transition-colors">
                        
                        {/* Product Title & Thumbnail */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.title}
                              className="w-14 h-14 rounded-xl object-cover border border-oat-border bg-oat flex-shrink-0"
                            />
                            <div className="space-y-0.5">
                              <h4 className="font-heading font-bold text-espresso text-sm line-clamp-1">
                                {prod.title}
                              </h4>
                              <p className="text-xs text-espresso-muted line-clamp-1">
                                {prod.subtitle || prod.description}
                              </p>
                              {prod.badgeTag && (
                                <span className="inline-block text-[10px] font-bold text-secondary bg-jaggery-100 px-2 py-0.5 rounded">
                                  {prod.badgeTag}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 text-xs font-semibold text-secondary whitespace-nowrap">
                          {prod.category}
                        </td>

                        {/* Weight Variants & Prices Pill Grid */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {prod.weightVariants?.map((v) => (
                              <span
                                key={v.weight}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                                  v.inStock !== false
                                    ? 'bg-oat text-espresso border-oat-border'
                                    : 'bg-rose-50 text-rose-600 border-rose-200 line-through'
                                }`}
                              >
                                <strong>{v.weight}:</strong>
                                <span className="text-primary font-bold">₹{v.price}</span>
                                {v.originalPrice > v.price && (
                                  <span className="text-[10px] text-espresso-muted line-through">₹{v.originalPrice}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Badges / Highlights */}
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {prod.isFeatured && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                            {prod.isBestseller && (
                              <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded">
                                Bestseller
                              </span>
                            )}
                            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                              100% Pure Jaggery
                            </span>
                          </div>
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-bold text-xs flex items-center gap-1 transition-all"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Edit Price</span>
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(prod._id || prod.slug, prod.title)}
                              className="p-1.5 rounded-xl text-espresso/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            <div className="bg-white p-4 rounded-2xl border border-oat-border shadow-soft flex items-center justify-between text-xs text-espresso-muted">
              <span>All customer orders placed via website & direct WhatsApp checkout:</span>
              <span className="font-bold text-espresso">{orders.length} orders recorded</span>
            </div>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-oat-border">
                  <div className="text-3xl">📦</div>
                  <h4 className="font-heading font-bold text-base text-espresso mt-2">No orders yet</h4>
                  <p className="text-xs text-espresso-muted">When customers order via WhatsApp, they will appear here.</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id || order.orderNumber}
                    className="p-5 bg-white rounded-3xl border border-oat-border shadow-soft space-y-4"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-oat-border pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-espresso">
                            Order #{order.orderNumber}
                          </span>
                          <span className="text-xs text-espresso-muted">
                            • {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="text-xs text-espresso mt-0.5">
                          Customer: <strong>{order.customerDetails?.name}</strong> • Phone: <strong className="text-emerald-700">{order.customerDetails?.phone}</strong>
                        </div>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-espresso-muted">Status:</span>
                        <select
                          value={order.orderStatus || 'Placed'}
                          onChange={(e) => handleUpdateOrderStatus(order._id || order.orderNumber, e.target.value)}
                          className="py-1.5 px-3 rounded-xl bg-oat border border-oat-border text-xs font-bold text-espresso focus:border-primary outline-none cursor-pointer"
                        >
                          <option value="Placed">⏳ Placed</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Dispatched">🚚 Dispatched</option>
                          <option value="Delivered">✅ Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5">
                        <span className="font-bold text-espresso uppercase tracking-wider text-[11px]">Ordered Snacks:</span>
                        <div className="space-y-1 bg-oat p-3 rounded-2xl border border-oat-border">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex justify-between text-espresso">
                              <span>{it.quantity} × {it.title} ({it.weight})</span>
                              <span className="font-bold">₹{it.totalPrice}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-oat-border flex justify-between font-bold text-espresso">
                            <span>Grand Total:</span>
                            <span className="text-primary text-sm font-extrabold">₹{order.grandTotal}</span>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address & Notes */}
                      <div className="space-y-1.5">
                        <span className="font-bold text-espresso uppercase tracking-wider text-[11px]">Delivery Location:</span>
                        <div className="p-3 bg-oat rounded-2xl border border-oat-border space-y-1 text-espresso">
                          <p>{order.deliveryAddress?.street}</p>
                          {order.deliveryAddress?.landmark && <p className="text-espresso-muted">Landmark: {order.deliveryAddress.landmark}</p>}
                          <p><strong>{order.deliveryAddress?.city}</strong>, {order.deliveryAddress?.state || 'AP'} - <strong>{order.deliveryAddress?.pincode}</strong></p>
                          {order.notes && <p className="text-secondary font-medium pt-1">Note: {order.notes}</p>}
                        </div>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

        {/* TAB 3: HEADER LOGO & BRAND SETTINGS */}
        {activeTab === 'brand' && (
          <LogoBrandEditor
            currentSettings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

        {/* TAB 4: HERO BANNER & MAIN PHOTO SETTINGS */}
        {activeTab === 'hero' && (
          <HeroSettingsEditor
            currentSettings={settings}
            onSaveSettings={handleSaveSettings}
          />
        )}

      </div>

      {/* Product Editor Modal */}
      <ProductEditorModal
        isOpen={isEditorOpen}
        product={editingProduct}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveProduct}
      />

    </div>
  );
};
