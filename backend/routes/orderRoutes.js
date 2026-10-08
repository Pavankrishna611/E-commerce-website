const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderByNumber,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    return protect(req, res, next);
  }
  next();
};

router.post('/', optionalAuth, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.get('/:orderNumber', getOrderByNumber);

module.exports = router;
