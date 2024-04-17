const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: { type: String },
  quantity: Number,
  price: { type: Number },
  type: { type: String },
  description: { type: String },
  colors: { type: [String] },
  sizes: { type: [String] },
  images: { type: [String] },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  for: { type: String },
});

const PRODUCT = mongoose.model("product", productSchema);
module.exports = PRODUCT;
