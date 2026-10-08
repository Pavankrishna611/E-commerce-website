const express = require('express');
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  adminLogin,
  getUserProfile,
  updateUserProfile,
  addAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/admin-login', adminLogin);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/addresses')
  .post(protect, addAddress);

router.route('/addresses/:id')
  .delete(protect, deleteAddress);

router.route('/addresses/:id/default')
  .put(protect, setDefaultAddress);

module.exports = router;
