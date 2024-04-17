const mongoose = require("mongoose");

const dbConnect = () => {
  mongoose
    .connect(
      "mongodb+srv://osamasrraj:Osama671010@cluster.zx3e9n6.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("connected");
    })
    .catch((err) => {
      console.log("ERROR WHILE CONNECT", err);
    });
};

module.exports = { dbConnect };
