const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://osamasrraj:Osama671010@cluster.zx3e9n6.mongodb.net/?retryWrites=true&w=majority"
  )
  .then()
  .catch((err) => {
    console.log(err);
  });
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
