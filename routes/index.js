var express = require("express");
var router = express.Router();
var Product = require("../models/product");
var Cart = require("../models/cart");
var Order = require("../models/order");

/* GET home page. */
router.get("/", async (req, res, next) => {
  var checkoutMsg = req.flash('checkout')[0]
  var notLoggedInMsg = req.flash('notLoggedIn')[0]
  var products = await Product.find().lean(); // .lean() -> get a JSON object instead of a mongoose one
  res.render("shop/index", { title: "Sneakers Shop", products: products,
              checkoutMsg: checkoutMsg, noCheckoutMsg: !checkoutMsg,
              notLoggedInMsg: notLoggedInMsg, noNotLoggedInMsg: !notLoggedInMsg});
});

router.get('/add-to-cart/:id', isLoggedIn, async function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}, totalQty: 0, totalPrice: 0});
  try{
    const product = await Product.findById(productId).lean(); // .lean() -> get a JSON object instead of a mongoose one
    cart.add(product, product._id);
    req.session.cart = cart;
    res.redirect('/');
  }
  catch{
    return res.redirect('/');
  }  
});

router.get('/reduce/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}, totalQty: 0, totalPrice: 0});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id', function(req, res, next) {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items:{}, totalQty: 0, totalPrice: 0});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function(req, res, next) {
  if (!req.session.cart) {
      return res.render('shop/shopping-cart', {products: null});
    }
  var cart = new Cart (req.session.cart);
  res.render('shop/shopping-cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', function(req, res, next) {
  if (!req.session.cart) {
      return res.redirect('/shopping-cart');
  }
  var order = new Order({
      user: req.user,
      cart: req.session.cart,
      price: req.session.cart.totalPrice
  });
  order.save();
  req.flash('checkout', 'Successfully bought products!');
  req.session.cart = {items:{}, totalQty: 0, totalPrice: 0};
  res.redirect('/');
});

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('notLoggedIn', 'Sign in or sign up to add to cart');
  res.redirect("/");
}
