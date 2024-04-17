const mongoose = require("mongoose");


const adminSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    email: String,
    photo: String,
    token: String,
    type: String,
  },
  { timestamps: true }
);

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
