var express = require("express");
var router = express.Router();
var Product = require("../models/product");

/* GET home page. */
router.get("/", async (req, res, next) => {
  var products = await Product.find().lean(); // .lean() -> get a JSON object instead of a mongoose one
  res.render("shop/index", { title: "Sneakers Shop", products: products });
});

module.exports = router;
