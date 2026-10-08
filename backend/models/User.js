const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Home',
  },
  street: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    default: '',
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    default: 'Andhra Pradesh',
  },
  pincode: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Valued Snack Lover',
    trim: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a 10-digit mobile number'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    default: '',
  },
  otpCode: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  addresses: [addressSchema],
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
