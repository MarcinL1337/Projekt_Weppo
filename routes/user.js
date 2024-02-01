var express = require("express");
var router = express.Router();
var csrf = require("csurf");
var passport = require("passport");
var Order = require('../models/order');
var Cart = require('../models/cart');


var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/profile", isLoggedIn, async function (req, res, next) {
  const orders = await Order.find({user: req.user}).lean();
    var cart;
    orders.forEach(function(order) {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
    });
    res.render('user/profile', { orders: orders });
});

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.use("/", isNotLoggedIn, function (req, res, next) {
  next();
});

router.get("/signup", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signup", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signup",
  passport.authenticate("local.signup", {
    failureRedirect: "/user/signup",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/user/profile");
  }
);

router.get("/signin", function (req, res, next) {
  var messages = req.flash("error");
  res.render("user/signin", {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0,
  });
});

router.post(
  "/signin",
  passport.authenticate("local.signin", {
    failureRedirect: "/user/signin",
    failureFlash: true,
  }),
  function (req, res) {
    res.redirect("/user/profile");
  }
);

module.exports = router;

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

function isNotLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
