const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
require("dotenv").config();
const Order = require("./Order");
const Cart = require("./Cart");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/api/cart", async (req, res) => {
  console.log(req.session.cart);
  if (!req.session.cart) {
    return res.json({ products: null, totalPrice: 0 });
  }
  console.log(req.session.cart);
  let newCart = new Cart(req.session.cart);
  req.session.cart = newCart;
  return res.json({
    cartProducts: newCart.getItems(),
    totalPrice: newCart.totalPrice,
    cart: newCart,
  });
});
app.post("/api/cart", async (req, res) => {
  const product = await (
    await fetch(`http://localhost:3215/api/products/${req.body.id}`, {
      method: "GET",
    })
  ).json();
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.add(product, req.body.id);
  req.session.cart = cart;
  console.log(req.session.cart);
  return res.json({
    cartProducts: cart.getItems(),
    totalPrice: cart.totalPrice,
    cart: cart,
  });
});
app.delete("/api/cart", async (req, res) => {
  let cart = new Cart(req.session.cart);
  cart.remove(req.body.id);
  res.json(cart);
});
app.post("/api/order", async (req, res) => {
  const order = new Order({
    user: req.body.user,
    address: req.body.address,
    phone: req.body.phone,
    cart: req.session.cart,
  });
  const result = await order.save();
  res.json(result);
});

app.listen(process.env.PORT, async () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`http://localhost:${process.env.PORT}/`);
  });
});
