const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const session = require("express-session");
const mongoSession = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "./public")));
const adminController = require("./controllers/adminController");
const productController = require("./controllers/productController");
const categoryController = require("./controllers/categoryController");
const userController = require("./controllers/userController");
const storeController = require("./controllers/storeController");
const superAdminController = require("./controllers/superAdminConrtoller");

const store = new mongoSession({
  uri: "mongodb+srv://osamasrraj:Osama671010@cluster.zx3e9n6.mongodb.net/?retryWrites=true&w=majority",
  collection: "Session",
});

app.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/", storeController);
app.use("/", adminController);
app.use("/", productController);
app.use("/", categoryController);
app.use("/", userController);
app.use("/", superAdminController);

app.listen(4000, () => {});
