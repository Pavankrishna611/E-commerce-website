const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductByIdentifier,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(createProduct);

router.route('/:identifier')
  .get(getProductByIdentifier)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
