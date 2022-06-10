const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  cart: {
    type: Object,
    required: true,
  },
});
const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
