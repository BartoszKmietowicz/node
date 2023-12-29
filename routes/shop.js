const path = require('path');
const express = require('express');

const dir = require('../util/path');
const router = express.Router();

const isAuth = require('../middleware/is-auth');

const shopController = require('../controllers/shop');
router.use(express.urlencoded({ extended: true }));
router.get('/', shopController.getIndex);

router.get('/products', shopController.getProductList);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cartDeleteItem', isAuth, shopController.postCartDeleteProduct);

router.get('/orders', isAuth, shopController.getOrders);
router.post('/createOrder', isAuth, shopController.postOrder);

module.exports = router;