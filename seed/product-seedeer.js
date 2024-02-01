/*
Commands for mongodb in shell:


cat /etc/mongod.conf | grep port -> check which port is mongodb connected to
sudo systemctl status mongod -> check if mongodb is activated
sudo systemctl start mongod -> turn mongodb on
sudo systemctl stop mongod -> turn mongodb off

*/

var Product = require("../models/product");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shop");

var products = [
  new Product({
    imagePath:
      "https://images.asos-media.com/products/new-balance-530-biao-szare-buty-sportowe/204470705-1-white?$n_750w$&wid=750&hei=750&fit=crop",
    title: "New Balance 530",
    description:
      "Stylowe i wygodne buty New Balance 530 to doskonałe połączenie retro designu z nowoczesną wygodą. Doskonała amortyzacja i trwała konstrukcja sprawiają, że są idealne na co dzień.",
    price: 399.99,
  }),
  new Product({
    imagePath:
      "https://images.asos-media.com/products/nike-training-air-monarch-iv-biae-buty-sportowe/203655107-1-white?$n_640w$&wid=513&fit=constrain",
    title: "Nike Monarch IV",
    description:
      "Nike Monarch IV to klasyczne buty treningowe, które oferują nie tylko wyjątkową wygodę, ale także wsparcie dla stóp. Ich uniwersalny design sprawia, że są idealne do aktywności sportowej i casualowego noszenia.",
    price: 259.99,
  }),
  new Product({
    imagePath:
      "https://sneaky.pl/cdn/shop/files/image_1dd91393-6ff4-48af-b4c7-43b23d508ccd.png?v=1686334481",
    title: "Air Jordan 1 Retro High Shadow",
    description:
      "Buty Air Jordan 1 Retro High Shadow to ikoniczny model inspirowany historią koszykówki. Wyjątkowy design, wysoka jakość wykonania i nawiązania do klasycznych kolorów sprawiają, że są nie tylko butami sportowymi, ale również modnym dodatkiem do stylizacji.",
    price: 1099.99,
  }),
];

const seedProducts = async () => {
  for (var i = 0; i < products.length; i++) {
    await products[i].save();
  }
};

seedProducts().then(() => {
  mongoose.disconnect();
});
