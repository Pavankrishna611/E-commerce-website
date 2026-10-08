import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vc_token'));
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.getProfile();
        setUser(userData);
      } catch (err) {
        console.warn('Could not restore auth session:', err.message);
        localStorage.removeItem('vc_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  // Step 1: Send OTP to Mobile Number
  const sendOtp = async (phone) => {
    try {
      const data = await api.sendOtp(phone);
      addToast(`OTP sent to +91 ${data.phone}! Test OTP: ${data.demoOtp || '123456'}`, 'info', 6000);
      return { success: true, data };
    } catch (err) {
      addToast(err.message || 'Failed to send OTP', 'error');
      return { success: false, error: err.message };
    }
  };

  // Step 2: Verify OTP and Login / Register
  const verifyOtp = async (phone, otp, name) => {
    try {
      const data = await api.verifyOtp(phone, otp, name);
      localStorage.setItem('vc_token', data.token);
      setToken(data.token);
      setUser(data);
      addToast(`Welcome ${data.name}!`, 'success');
      return { success: true, user: data };
    } catch (err) {
      addToast(err.message || 'OTP verification failed', 'error');
      return { success: false, error: err.message };
    }
  };

  // Admin Username & Password Login (No hardcoded credentials)
  const loginAdmin = async (username, password) => {
    if (!username || !password) {
      addToast('Please enter both username and password', 'error');
      return { success: false, error: 'Username and password are required' };
    }
    try {
      const data = await api.adminLogin(username, password);
      localStorage.setItem('vc_token', data.token);
      setToken(data.token);
      setUser(data);
      addToast('Admin Portal Authenticated!', 'success');
      return { success: true };
    } catch (err) {
      addToast(err.message || 'Invalid Admin Username or Password', 'error');
      return { success: false, error: err.message };
    }
  };

  // 1-Click Demo Login
  const loginDemo = async () => {
    return await verifyOtp('9876543210', '123456', 'Demo Customer');
  };

  const logout = () => {
    localStorage.removeItem('vc_token');
    setToken(null);
    setUser(null);
    addToast('Logged out successfully', 'info');
  };

  const addAddress = async (addressData) => {
    try {
      if (user) {
        const updatedAddresses = await api.addAddress(addressData);
        setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
        addToast('Delivery address added', 'success');
        return true;
      }
      return false;
    } catch (err) {
      addToast(err.message || 'Failed to add address', 'error');
      return false;
    }
  };

  const deleteAddress = async (addressId) => {
    try {
      if (user) {
        const updatedAddresses = await api.deleteAddress(addressId);
        setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
        addToast('Address removed', 'info');
        return true;
      }
      return false;
    } catch (err) {
      addToast(err.message || 'Failed to delete address', 'error');
      return false;
    }
  };

  const setDefaultAddress = async (addressId) => {
    try {
      if (user) {
        const updatedAddresses = await api.setDefaultAddress(addressId);
        setUser((prev) => ({ ...prev, addresses: updatedAddresses }));
        addToast('Default address updated', 'success');
        return true;
      }
      return false;
    } catch (err) {
      addToast(err.message || 'Failed to set default address', 'error');
      return false;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin,
        sendOtp,
        verifyOtp,
        loginAdmin,
        loginDemo,
        logout,
        addAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
