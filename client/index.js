const express = require("express");
const session = require("express-session");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use("/products/:id", express.static(__dirname + "/public"));
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.get("/", async (req, res) => {
  const products = await (
    await fetch("http://localhost:3215/api/products")
  ).json();
  return res.render("index", { products });
});
app.get("/account", async (req, res) => {
  const userCart = await (
    await fetch("http://localhost:3214/api/cart", {
      method: "GET",
    })
  ).json();
  return res.render("account", {
    totalPrice: userCart.totalPrice,
    cart: userCart.cart,
  });
});
app.get("/products", async (req, res) => {
  const products = await (
    await fetch("http://localhost:3215/api/products")
  ).json();
  const userCart = await (
    await fetch("http://localhost:3214/api/cart", {
      method: "GET",
    })
  ).json();
  return res.render("products", {
    products,
    totalPrice: userCart.totalPrice,
    cart: userCart.cart,
  });
});
app.get("/products/:id", async (req, res) => {
  const product = await (
    await fetch(`http://localhost:3215/api/products/${req.params.id}`, {
      method: "GET",
    })
  ).json();
  const products = await (
    await fetch("http://localhost:3215/api/products")
  ).json();
  const userCart = await (
    await fetch("http://localhost:3214/api/cart", {
      method: "GET",
    })
  ).json();
  console.log(userCart);
  return res.render("single", {
    products,
    product,
    totalPrice: userCart.totalPrice,
    cart: userCart.cart,
  });
});
app.get("/cart/add/:id", async (req, res) => {
  let id = req.params.id;
  const product = await (
    await fetch(`http://localhost:3215/api/products/${id}`, {
      method: "GET",
    })
  ).json();
  console.log(product);
  const userCart = await (
    await fetch("http://localhost:3214/api/cart", {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        id: product._id,
        quantity: 1,
      }),
    })
  ).json();
  return res.redirect(`/products/${id}`);
});
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
