const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth, adminController.getAddProduct);
router.get('/products', isAuth, adminController.getProducts);
router.get('/editProduct/:productId', isAuth, adminController.getEditProduct);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.post('/editProduct', isAuth, adminController.postEditProduct);
router.post('/deleteProduct', isAuth, adminController.postDeleteProduct);
module.exports = router;