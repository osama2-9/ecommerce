const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log("ERROR WHILE CONNECT", err);
    });
};

module.exports = { dbConnect };
