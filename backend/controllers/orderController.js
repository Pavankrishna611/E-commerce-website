const mongoose = require('mongoose');
const Order = require('../models/Order');

// In-memory fallback order store
const memoryOrders = [
  {
    _id: 'order-sample-001',
    orderNumber: 'VC-2608-4102',
    customerDetails: {
      name: 'Priya Reddy',
      phone: '9848022338',
      alternatePhone: '9848022339',
    },
    deliveryAddress: {
      street: 'Flat 204, Lakshmi Nilayam, Benz Circle',
      landmark: 'Opp Trendset Mall',
      city: 'Vijayawada',
      state: 'Andhra Pradesh',
      pincode: '520010',
    },
    items: [
      {
        title: 'Homemade Peanut Chikki',
        weight: '1kg',
        quantity: 1,
        unitPrice: 399,
        totalPrice: 399,
      },
      {
        title: 'Sesame Chikki (Til Patti)',
        weight: '500g',
        quantity: 1,
        unitPrice: 250,
        totalPrice: 250,
      },
    ],
    subtotal: 649,
    discount: 65,
    couponCode: 'VINAYAKA10',
    deliveryFee: 0,
    grandTotal: 584,
    orderStatus: 'Dispatched',
    paymentMethod: 'WhatsApp Direct (UPI / COD)',
    notes: 'Please pack in traditional clay box gift packing',
    createdAt: new Date(Date.now() - 3600000 * 5),
  },
];

// Helper to generate formatted WhatsApp text message
const formatWhatsAppMessage = ({ orderNumber, customerDetails, deliveryAddress, items, subtotal, discount, deliveryFee, grandTotal, notes }) => {
  const sellerPhone = process.env.SELLER_WHATSAPP_NUMBER || '919949846972';
  
  let msg = `*🛒 NEW ORDER - VINAYAKA CHIKKIS*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `*Order ID:* #${orderNumber}\n`;
  msg += `*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n`;
  
  msg += `*👤 Customer Details:*\n`;
  msg += `• Name: ${customerDetails.name}\n`;
  msg += `• Phone: ${customerDetails.phone}\n`;
  if (customerDetails.alternatePhone) {
    msg += `• Alt Phone: ${customerDetails.alternatePhone}\n`;
  }
  
  msg += `\n*📍 Delivery Address:*\n`;
  msg += `${deliveryAddress.street}\n`;
  if (deliveryAddress.landmark) {
    msg += `Landmark: ${deliveryAddress.landmark}\n`;
  }
  msg += `${deliveryAddress.city}, ${deliveryAddress.state || 'Andhra Pradesh'} - *${deliveryAddress.pincode}*\n\n`;
  
  msg += `*📦 Ordered Items:*\n`;
  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.title}* (${item.weight})\n`;
    msg += `   └ Qty: ${item.quantity} × ₹${item.unitPrice} = *₹${item.totalPrice}*\n`;
  });
  
  msg += `\n*💰 Payment & Price Summary:*\n`;
  msg += `• Subtotal: ₹${subtotal}\n`;
  if (discount > 0) {
    msg += `• Discount: -₹${discount}\n`;
  }
  msg += `• Delivery: ${deliveryFee === 0 ? 'FREE (Special Offer)' : `₹${deliveryFee}`}\n`;
  msg += `• *Final Total Amount: ₹${grandTotal}*\n`;
  msg += `• Payment: WhatsApp Pay / UPI / COD\n`;
  
  if (notes) {
    msg += `\n*📝 Delivery Notes:* ${notes}\n`;
  }
  
  msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ *Thank you for supporting traditional homemade sweets!*`;

  const encodedMessage = encodeURIComponent(msg);
  const redirectUrl = `https://wa.me/${sellerPhone}?text=${encodedMessage}`;

  return { plainText: msg, redirectUrl };
};

const createOrder = async (req, res) => {
  try {
    const {
      customerDetails,
      deliveryAddress,
      items,
      subtotal,
      discount,
      couponCode,
      deliveryFee,
      grandTotal,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.phone) {
      return res.status(400).json({ message: 'Customer name and phone are required' });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.pincode) {
      return res.status(400).json({ message: 'Complete delivery address is required' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VC-${new Date().getFullYear().toString().slice(-2)}${String(new Date().getMonth() + 1).padStart(2, '0')}-${randomSuffix}`;

    const { plainText, redirectUrl } = formatWhatsAppMessage({
      orderNumber,
      customerDetails,
      deliveryAddress,
      items,
      subtotal: subtotal || items.reduce((acc, it) => acc + it.totalPrice, 0),
      discount: discount || 0,
      deliveryFee: deliveryFee !== undefined ? deliveryFee : (subtotal >= 499 ? 0 : 40),
      grandTotal: grandTotal || (subtotal - (discount || 0) + (deliveryFee || 0)),
      notes,
    });

    const orderData = {
      orderNumber,
      user: req.user ? req.user._id : null,
      customerDetails,
      deliveryAddress,
      items,
      subtotal: subtotal || items.reduce((acc, it) => acc + it.totalPrice, 0),
      discount: discount || 0,
      couponCode: couponCode || '',
      deliveryFee: deliveryFee !== undefined ? deliveryFee : (subtotal >= 499 ? 0 : 40),
      grandTotal: grandTotal,
      paymentMethod: 'WhatsApp Direct (UPI / COD)',
      orderStatus: 'Placed',
      whatsappMessage: plainText,
      whatsappRedirectUrl: redirectUrl,
      notes: notes || '',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState !== 1) {
      orderData._id = 'order-' + Date.now();
      memoryOrders.unshift(orderData);
      return res.status(201).json({
        success: true,
        order: orderData,
        whatsappMessage: plainText,
        whatsappRedirectUrl: redirectUrl,
      });
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder,
      whatsappMessage: plainText,
      whatsappRedirectUrl: redirectUrl,
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userPhone = req.user?.phone || '9876543210';
      const userOrders = memoryOrders.filter(
        (o) =>
          o.customerDetails?.phone === userPhone ||
          o.user === req.user?._id ||
          o.user === 'demo-user-id-001'
      );
      return res.json(userOrders);
    }
    const orders = await Order.find({
      $or: [{ user: req.user._id }, { 'customerDetails.phone': req.user.phone }],
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/all
// @access  Public / Admin
const getAllOrders = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(memoryOrders);
    }
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order delivery status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Public / Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState === 1) {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.orderStatus = status;
      const updated = await order.save();
      return res.json(updated);
    } else {
      const order = memoryOrders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      order.orderStatus = status;
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderByNumber = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const order = memoryOrders.find((o) => o.orderNumber === req.params.orderNumber);
      if (order) return res.json(order);
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderByNumber,
};
