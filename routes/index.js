'use strict';
const express  = require('express');
const router   = express.Router();
const shopCtrl = require('../controllers/shopController');
const authCtrl = require('../controllers/authController');

// ── Shop ──────────────────────────────────────────────────────
router.get('/',             shopCtrl.showShop);
router.post('/cart/add',    shopCtrl.addToCart);
router.get('/cart',         shopCtrl.showCart);
router.post('/cart/update', shopCtrl.updateCart);
router.post('/cart/remove', shopCtrl.removeFromCart);
router.post('/cart/clear',  shopCtrl.clearCart);

// ── Checkout & Orders (login required) ───────────────────────
router.get ('/checkout', authCtrl.requireLogin, shopCtrl.showCheckout);
router.post('/checkout', authCtrl.requireLogin, shopCtrl.placeOrder);
router.get ('/orders',   authCtrl.requireLogin, shopCtrl.showOrderHistory);

// ── Auth ──────────────────────────────────────────────────────
router.get ('/login',    authCtrl.showLogin);
router.post('/login',    authCtrl.login);
router.get ('/logout',   authCtrl.logout);
router.get ('/register', authCtrl.showRegister);
router.post('/register', authCtrl.register);
router.get ('/profile',  authCtrl.requireLogin, authCtrl.showProfile);

const staffCtrl = require('../controllers/staffController');

// ── Staff (CRUD Products) ─────────────────────────────────────
router.get ('/staff/products', authCtrl.requireStaff, staffCtrl.listProducts);
router.get ('/staff/products/new', authCtrl.requireStaff, staffCtrl.showAddProduct);
router.post('/staff/products/new', authCtrl.requireStaff, staffCtrl.addProduct);
router.get ('/staff/products/:id/edit', authCtrl.requireStaff, staffCtrl.showEditProduct);
router.post('/staff/products/:id/edit', authCtrl.requireStaff, staffCtrl.updateProduct);
router.post('/staff/products/:id/delete', authCtrl.requireStaff, staffCtrl.deleteProduct);

module.exports = router;
