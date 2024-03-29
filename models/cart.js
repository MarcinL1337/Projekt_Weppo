module.exports = function Cart(oldCart) {
  this.items = oldCart.items;
  this.totalQty = oldCart.totalQty;
  this.totalPrice = Number.parseFloat(oldCart.totalPrice).toFixed(2);

  this.add = function (item, id) {
    var storedItem = this.items[id];
    if (!storedItem) {
      storedItem = this.items[id] = { item: item, qty: 0, price: 0 };
    }
    storedItem.qty++;
    storedItem.price = Number.parseFloat(
      storedItem.item.price * storedItem.qty
    ).toFixed(2);
    this.totalQty++;
    var temp = Number.parseFloat(this.totalPrice);
    this.totalPrice = Number.parseFloat(temp + storedItem.item.price).toFixed(
      2
    );
  };

  this.reduceByOne = function (id) {
    this.items[id].qty--;
    this.items[id].price -= this.items[id].item.price;
    this.items[id].price = Number.parseFloat(this.items[id].price).toFixed(2);
    this.totalQty--;
    this.totalPrice -= this.items[id].item.price;
    this.totalPrice = Number.parseFloat(this.totalPrice).toFixed(2);

    if (this.items[id].qty <= 0) {
      delete this.items[id];
    }
  };

  this.removeItem = function (id) {
    this.totalQty -= this.items[id].qty;
    this.totalPrice -= this.items[id].price;
    this.totalPrice = Number.parseFloat(this.totalPrice).toFixed(2);
    delete this.items[id];
  };

  this.generateArray = function () {
    var arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    return arr;
  };
};
