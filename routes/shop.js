const path = require('path');
const express = require('express');

const dir = require('../util/path');
const router = express.Router();

const shopController = require('../controllers/shop');
router.use(express.urlencoded({ extended: true }));
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProductList);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', shopController.getCart);
router.post('/cart', shopController.postCart);
router.post('/cartDeleteItem', shopController.postCartDeleteProduct);

router.get('/orders', shopController.getOrders);

router.get('/checkout', shopController.getCheckout);

exports.routes = router;
