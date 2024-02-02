/*
Commands for mongodb in shell:


cat /etc/mongod.conf | grep port -> check which port is mongodb connected to
sudo systemctl status mongod -> check if mongodb is activated
sudo systemctl start mongod -> turn mongodb on
sudo systemctl stop mongod -> turn mongodb off

*/

var User = require("../models/user");

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/shop");

var admin =   new User({
    email: "admin@admin.admin",
    password: "admin",
    isAdmin: true
  })
admin.password = admin.encryptPassword(admin.password);

var users = [admin];

const seedUsers = async () => {
  for (var i = 0; i < users.length; i++) {
    await users[i].save();
  }
};

seedUsers().then(() => {
  mongoose.disconnect();
});
