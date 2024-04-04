const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/ecommerce")
  .then(() => {})
  .catch((err) => {
    console.log(err);
  });

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
