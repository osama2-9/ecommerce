const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("connect"))
  .catch((err) => {
    console.log(err);
  });
const categorySchema = new mongoose.Schema({
  categoryname: String,
});

const category = mongoose.model("category", categorySchema);
module.exports = category;
