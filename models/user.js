const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    phone: Number,
    paymentMethod: String,
    image: String,
    spent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const newUser = mongoose.model("user", userSchema);
module.exports = newUser;
