const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  customerDetails: {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    alternatePhone: {
      type: String,
      default: '',
    },
  },
  deliveryAddress: {
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
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: '',
  },
  deliveryFee: {
    type: Number,
    default: 0,
  },
  grandTotal: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: 'WhatsApp Checkout (UPI / COD)',
  },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Packed', 'Dispatched', 'Delivered', 'Cancelled'],
    default: 'Placed',
  },
  whatsappMessage: {
    type: String,
    default: '',
  },
  whatsappRedirectUrl: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
