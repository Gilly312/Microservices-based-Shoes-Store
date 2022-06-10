const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const Product = require("./Product");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find();
    return res.json(products);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
});
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
app.post("/api/products", async (req, res) => {
  try {
    let { name, brand, description, price, image, category, quantity, stock } =
      req.body;
    const product = new Product({
      name,
      brand,
      description,
      price,
      image,
      category,
      stock,
    });
    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.delete("/api/products", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.body.id);
    res.status(200).json({ message: "Deleted" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.put("/api/products/:productId", async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.productId },
      req.body,
      { new: true }
    );
    return res.status(200).json({ product });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
app.listen(process.env.PORT, async () => {
  mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`"http://localhost:${process.env.PORT}/"`);
  });
});
