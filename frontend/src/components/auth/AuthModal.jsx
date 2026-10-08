import React, { useState } from 'react';
import { X, Phone, KeyRound, User, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Lock, Edit3, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState('phone'); // 'phone' | 'otp' | 'admin'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState('');

  const { sendOtp, verifyOtp, loginAdmin, loginDemo } = useAuth();
  const { addToast } = useToast();

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      addToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await sendOtp(cleanPhone);
    setLoading(false);

    if (res.success) {
      setDemoOtpHint(res.data?.demoOtp || '123456');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      addToast('Please enter the 6-digit OTP', 'error');
      return;
    }

    setLoading(true);
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const res = await verifyOtp(cleanPhone, otp, name);
    setLoading(false);

    if (res.success) {
      onClose();
      resetForm();
    }
  };

  const handleAdminAuthLogin = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword.trim()) {
      addToast('Username and password are required', 'error');
      return;
    }

    setLoading(true);
    const res = await loginAdmin(adminUsername.trim(), adminPassword.trim());
    setLoading(false);

    if (res.success) {
      onClose();
      resetForm();
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const res = await loginDemo();
    setLoading(false);
    if (res.success) {
      onClose();
      resetForm();
    }
  };

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setName('');
    setAdminUsername('');
    setAdminPassword('');
    setDemoOtpHint('');
    setShowAdminPassword(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-espresso/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-oat-border modal-animate relative">
        
        {/* Close Button */}
        <button
          onClick={() => {
            onClose();
            resetForm();
          }}
          className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-espresso via-secondary to-primary text-white text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto text-2xl mb-2">
            {step === 'admin' ? '🔒' : '🥜'}
          </div>
          <h3 className="font-heading font-bold text-xl text-white">
            {step === 'admin' ? 'Store Owner Admin Portal' : 'Login / Register with Mobile'}
          </h3>
          <p className="text-xs text-white/80">
            {step === 'admin'
              ? 'Login with admin credentials to manage products & prices'
              : 'Zero passwords needed • Instant 6-digit OTP verification'}
          </p>
        </div>

        {/* Quick Demo Login Bar */}
        {step !== 'admin' && (
          <div className="p-4 bg-jaggery-50 border-b border-jaggery-100 flex items-center justify-between">
            <span className="text-xs text-espresso font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Fast 1-Click Login:
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center gap-1"
            >
              <span>⚡ Demo Customer (+91 9876543210)</span>
            </button>
          </div>
        )}

        {/* Body based on step */}
        <div className="p-6">
          
          {/* STEP 1: ENTER PHONE NUMBER */}
          {step === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">
                  Indian Mobile Number *
                </label>
                <div className="flex items-center rounded-xl bg-oat border border-oat-border focus-within:border-primary focus-within:bg-white overflow-hidden transition-all">
                  <span className="px-3 py-2.5 bg-oat-border/50 text-xs font-bold text-espresso border-r border-oat-border flex items-center gap-1">
                    🇮🇳 +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm font-semibold text-espresso outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">
                  Your Full Name (Optional)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm text-espresso focus:bg-white focus:border-primary outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Sending OTP Code...' : 'Get 6-Digit OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-3 border-t border-oat-border flex items-center justify-between text-xs text-espresso-muted">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Safe & Secure
                </span>
                <button
                  type="button"
                  onClick={() => setStep('admin')}
                  className="font-bold text-secondary hover:underline flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" /> Store Admin Login
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: ENTER OTP */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                <div>
                  <span>OTP sent to: <strong>+91 {phone}</strong></span>
                  {demoOtpHint && (
                    <div className="mt-0.5 text-emerald-700 font-bold">
                      💡 Test OTP: <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-300">{demoOtpHint}</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-secondary font-bold hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">
                  Enter 6-Digit OTP *
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2.5 bg-oat border border-oat-border rounded-xl text-center text-lg font-mono font-bold tracking-widest text-espresso focus:bg-white focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Auto-fill button for testing */}
              {demoOtpHint && (
                <button
                  type="button"
                  onClick={() => setOtp(demoOtpHint)}
                  className="w-full py-1.5 bg-jaggery-100 text-secondary hover:bg-jaggery-200 text-xs font-bold rounded-lg transition-colors"
                >
                  ⚡ Auto-fill Test OTP ({demoOtpHint})
                </button>
              )}

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Verifying OTP...' : 'Verify & Continue'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs text-espresso-muted hover:text-primary font-semibold"
                >
                  Didn't receive code? Resend OTP
                </button>
              </div>

            </form>
          )}

          {/* STEP 3: ADMIN USERNAME & PASSWORD LOGIN */}
          {step === 'admin' && (
            <form onSubmit={handleAdminAuthLogin} className="space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                🔒 <strong>Store Owner Authentication:</strong> Please log in with your administrative username & password.
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Admin Username *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter admin username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-espresso mb-1">Admin Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-espresso-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-oat border border-oat-border rounded-xl text-xs sm:text-sm font-semibold text-espresso focus:bg-white focus:border-primary outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso-muted hover:text-espresso"
                    title={showAdminPassword ? "Hide password" : "Show password"}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                className="w-full py-1.5 bg-amber-100/70 hover:bg-amber-200 text-amber-900 text-xs font-bold rounded-lg border border-amber-300 transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>⚡ Auto-fill Admin Credentials (chikki / chikki123)</span>
              </button>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-espresso hover:bg-espresso-light text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{loading ? 'Logging In...' : 'Login to Admin Portal'}</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  ← Back to Customer Mobile Login
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
