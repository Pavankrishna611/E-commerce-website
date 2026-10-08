const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vinayaka_chikkis_secret_key_2026');
      
      if (mongoose.connection.readyState === 1 && String(decoded.id).match(/^[0-9a-fA-F]{24}$/)) {
        req.user = await User.findById(decoded.id).select('-otpCode -otpExpiresAt');
      }
      
      if (!req.user) {
        req.user = {
          _id: decoded.id,
          name: decoded.id === 'admin-user-id-001' ? 'Vinayaka Admin Store Owner' : 'Demo Customer',
          phone: decoded.id === 'admin-user-id-001' ? '9999999999' : '9876543210',
          role: decoded.id === 'admin-user-id-001' ? 'admin' : 'customer',
        };
      }
      return next();
    } catch (error) {
      console.error('Auth token validation failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'vinayaka_chikkis_secret_key_2026', {
    expiresIn: '30d',
  });
};

module.exports = { protect, generateToken };
