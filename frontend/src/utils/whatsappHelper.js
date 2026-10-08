/**
 * WhatsApp Helper for Vinayaka Chikkis
 * Formats itemized checkout strings and constructs wa.me links.
 */

export const DEFAULT_SELLER_PHONE = '919949846972';

export const formatWhatsAppOrderMessage = ({
  orderNumber = '',
  customerDetails = {},
  deliveryAddress = {},
  items = [],
  subtotal = 0,
  discount = 0,
  deliveryFee = 0,
  grandTotal = 0,
  notes = '',
}) => {
  let msg = `*🛒 NEW ORDER - VINAYAKA CHIKKIS*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  if (orderNumber) {
    msg += `*Order ID:* #${orderNumber}\n`;
  }
  msg += `*Date:* ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}\n\n`;

  msg += `*👤 Customer Details:*\n`;
  msg += `• Name: ${customerDetails.name || 'Valued Customer'}\n`;
  msg += `• Phone: ${customerDetails.phone || 'N/A'}\n`;
  if (customerDetails.alternatePhone) {
    msg += `• Alt Phone: ${customerDetails.alternatePhone}\n`;
  }

  msg += `\n*📍 Delivery Address:*\n`;
  msg += `${deliveryAddress.street || ''}\n`;
  if (deliveryAddress.landmark) {
    msg += `Landmark: ${deliveryAddress.landmark}\n`;
  }
  msg += `${deliveryAddress.city || ''}, ${deliveryAddress.state || 'Andhra Pradesh'} - *${deliveryAddress.pincode || ''}*\n\n`;

  msg += `*📦 Ordered Items:*\n`;
  items.forEach((item, index) => {
    msg += `${index + 1}. *${item.title}* (${item.weight})\n`;
    msg += `   └ Qty: ${item.quantity} × ₹${item.unitPrice} = *₹${item.totalPrice || item.quantity * item.unitPrice}*\n`;
  });

  msg += `\n*💰 Price Summary:*\n`;
  msg += `• Subtotal: ₹${subtotal}\n`;
  if (discount > 0) {
    msg += `• Special Discount: -₹${discount}\n`;
  }
  msg += `• Delivery: ${deliveryFee === 0 ? 'FREE (Special Offer)' : `₹${deliveryFee}`}\n`;
  msg += `• *Final Payable Total: ₹${grandTotal}*\n`;
  msg += `• Preferred Payment: WhatsApp Pay / UPI / COD\n`;

  if (notes) {
    msg += `\n*📝 Special Instructions:* ${notes}\n`;
  }

  msg += `\n━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ *Thank you for supporting traditional homemade sweets!*`;

  return msg;
};

export const generateWhatsAppUrl = (message, sellerPhone = DEFAULT_SELLER_PHONE) => {
  const cleanPhone = sellerPhone.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encoded}`;
};
