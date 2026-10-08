const mongoose = require('mongoose');
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Temporary in-memory OTP and User cache for offline resilience
const tempOtpStore = new Map(); // phone -> { otp, expiresAt, name }

const memoryUsers = [
  {
    _id: 'demo-user-id-001',
    name: 'Demo Customer',
    phone: '9876543210',
    email: 'demo@vinayakachikkis.com',
    role: 'customer',
    addresses: [
      {
        _id: 'addr-001',
        title: 'Home',
        street: 'Flat 402, Sri Vinayaka Nilayam, Ring Road',
        landmark: 'Near Sri Ram Mandir',
        city: 'Vijayawada',
        state: 'Andhra Pradesh',
        pincode: '520008',
        isDefault: true,
      },
    ],
  },
  {
    _id: 'admin-user-id-001',
    name: 'Vinayaka Admin Store Owner',
    phone: '9999999999',
    email: 'admin@vinayakachikkis.com',
    role: 'admin',
    addresses: [],
  },
];

// @desc    Generate and send 6-digit OTP to Phone Number
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ message: 'Please provide a valid 10-digit mobile number' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);

    // Generate 6-digit OTP (e.g. 123456 for demo or random)
    const otp = cleanPhone === '9876543210' || cleanPhone === '9999999999'
      ? '123456'
      : Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    tempOtpStore.set(cleanPhone, { otp, expiresAt });

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ phone: cleanPhone });
      if (user) {
        user.otpCode = otp;
        user.otpExpiresAt = expiresAt;
        await user.save();
      }
    }

    console.log(`📲 [SMS GATEWAY SIMULATION] OTP for +91 ${cleanPhone} is: ${otp}`);

    res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      phone: cleanPhone,
      // Provide OTP in response for instant testing in local environment
      demoOtp: otp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and log in / register customer
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: 'Phone number and OTP code are required' });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const stored = tempOtpStore.get(cleanPhone);

    const isValidDemoOtp = otp === '123456';
    const isStoredOtpValid = stored && stored.otp === otp && new Date() < stored.expiresAt;

    if (!isValidDemoOtp && !isStoredOtpValid) {
      // Check MongoDB if connected
      if (mongoose.connection.readyState === 1) {
        const dbUser = await User.findOne({ phone: cleanPhone, otpCode: otp });
        if (!dbUser || (dbUser.otpExpiresAt && new Date() > dbUser.otpExpiresAt)) {
          return res.status(400).json({ message: 'Invalid or expired OTP. Try 123456 or resend.' });
        }
      } else {
        return res.status(400).json({ message: 'Invalid or expired OTP. Try 123456 or resend.' });
      }
    }

    // Success: Find or create user
    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({ phone: cleanPhone });

      if (!user) {
        user = await User.create({
          phone: cleanPhone,
          name: name?.trim() || `Customer ${cleanPhone.slice(-4)}`,
          role: cleanPhone === '9999999999' ? 'admin' : 'customer',
        });
      } else if (name && (!user.name || user.name.startsWith('Customer '))) {
        user.name = name.trim();
        await user.save();
      }

      // Clear OTP
      user.otpCode = null;
      user.otpExpiresAt = null;
      await user.save();

      return res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        addresses: user.addresses,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      // Memory fallback
      let user = memoryUsers.find((u) => u.phone === cleanPhone);
      if (!user) {
        user = {
          _id: 'user-' + Date.now(),
          name: name?.trim() || `Customer ${cleanPhone.slice(-4)}`,
          phone: cleanPhone,
          email: '',
          role: cleanPhone === '9999999999' ? 'admin' : 'customer',
          addresses: [],
        };
        memoryUsers.push(user);
      } else if (name && user.name.startsWith('Customer ')) {
        user.name = name.trim();
      }

      return res.json({
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        addresses: user.addresses,
        role: user.role,
        token: generateToken(user._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin authentication via username & password
// @route   POST /api/auth/admin-login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const expectedUsername = (process.env.ADMIN_USERNAME || 'chikki').trim().toLowerCase();
    const expectedPassword = (process.env.ADMIN_PASSWORD || 'chikki123').trim();

    if (username.trim().toLowerCase() === expectedUsername && password.trim() === expectedPassword) {
      const adminUser = {
        _id: 'admin-user-id-001',
        name: 'Vinayaka Admin (Store Owner)',
        username: expectedUsername,
        phone: '9949846972',
        role: 'admin',
      };

      return res.json({
        _id: adminUser._id,
        name: adminUser.name,
        username: adminUser.username,
        phone: adminUser.phone,
        role: 'admin',
        token: generateToken(adminUser._id),
      });
    }

    return res.status(401).json({ message: 'Invalid Admin Username or Password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    if (req.user && (req.user.role === 'admin' || req.user._id === 'admin-user-id-001')) {
      return res.json({
        _id: 'admin-user-id-001',
        name: 'Vinayaka Admin (Store Owner)',
        username: 'chikki',
        phone: '9949846972',
        role: 'admin',
        addresses: [],
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const user = memoryUsers.find((u) => u._id === req.user?._id) || memoryUsers[0];
      return res.json(user);
    }

    if (String(req.user._id).match(/^[0-9a-fA-F]{24}$/)) {
      const user = await User.findById(req.user._id).select('-otpCode -otpExpiresAt');
      if (user) return res.json(user);
    }

    if (req.user) {
      return res.json(req.user);
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = memoryUsers.find((u) => u._id === req.user?._id) || memoryUsers[0];
      user.name = req.body.name || user.name;
      user.email = req.body.email !== undefined ? req.body.email : user.email;
      return res.json(user);
    }

    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email !== undefined ? req.body.email : user.email;
      const updatedUser = await user.save();
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add address
// @route   POST /api/auth/addresses
// @access  Private
const addAddress = async (req, res) => {
  try {
    const { title, street, landmark, city, state, pincode, isDefault } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const user = memoryUsers.find((u) => u._id === req.user?._id) || memoryUsers[0];
      if (isDefault) user.addresses.forEach((a) => (a.isDefault = false));
      const newAddr = {
        _id: 'addr-' + Date.now(),
        title: title || 'Home',
        street,
        landmark: landmark || '',
        city,
        state: state || 'Andhra Pradesh',
        pincode,
        isDefault: isDefault || user.addresses.length === 0,
      };
      user.addresses.push(newAddr);
      return res.status(201).json(user.addresses);
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (isDefault || user.addresses.length === 0) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push({
      title: title || 'Home',
      street,
      landmark: landmark || '',
      city,
      state: state || 'Andhra Pradesh',
      pincode,
      isDefault: isDefault || user.addresses.length === 0,
    });

    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/auth/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = memoryUsers.find((u) => u._id === req.user?._id) || memoryUsers[0];
      user.addresses = user.addresses.filter((a) => a._id !== req.params.id);
      return res.json(user.addresses);
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/auth/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const user = memoryUsers.find((u) => u._id === req.user?._id) || memoryUsers[0];
      user.addresses.forEach((a) => (a.isDefault = a._id === req.params.id));
      return res.json(user.addresses);
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.forEach((addr) => {
      addr.isDefault = addr._id.toString() === req.params.id;
    });

    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendOtp,
  verifyOtp,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress,
};
