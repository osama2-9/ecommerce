const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    PID: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
    UID: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    Username: String,
    productName: String,
    qauntity: Number,
    color: { type: [String] },
    size: { type: [String] },
    price: Number,
    paymentMethod: String,
  },
  { timestamps: true }
);

const order = mongoose.model("order", OrderSchema);
module.exports = order;
