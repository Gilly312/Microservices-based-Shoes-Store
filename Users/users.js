const express = require("express");
const mongoose = require("mongoose");
const app = express();

const User = require("./User");
require("dotenv").config();
const auth = require("./auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  try {
    const { email, password, fullname, address, phone, age } = req.body;
    const existUser = await User.findByCredentials(email, password);
    if (existUser) {
      return res.status(400).json({ error: "User Existed" });
    }
    const user = new User({
      email,
      password,
      fullname,
      address,
      phone,
      age,
    });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(400).json(e);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const token = await user.generateAuthToken();
    res.json({ user, token });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});
app.get("/users/me", auth, async (req, res) => {
  res.json({ user: req.user });
});
app.post("/users/me/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.json({ message: "Logged out" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});
