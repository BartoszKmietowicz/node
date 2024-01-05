const path = require('path');
const express = require('express');
const { check } = require('express-validator');
const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/editProduct/:productId', isAuth, adminController.getEditProduct);
router.post(
  '/add-product',

  check('title', 'title must have at least 3 characters')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 3 }),
  check('price', 'invalid price').isFloat(),
  check(
    'description',
    'description should be between 5 and 400 characters long'
  )
    .isLength({ min: 5, max: 400 })
    .trim(),

  isAuth,
  adminController.postAddProduct
);
router.post(
  '/editProduct',

  check('title', 'title must have at least 3 characters')
    .trim()
    .isAlphanumeric()
    .isLength({ min: 3 }),
  check('price', 'invalid price').isFloat(),
  check(
    'description',
    'description should be between 5 and 400 characters long'
  )
    .isLength({ min: 5, max: 400 })
    .trim(),

  isAuth,
  adminController.postEditProduct
);
router.delete('/deleteProduct', isAuth, adminController.postDeleteProduct);
module.exports = router;