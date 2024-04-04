const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("../uploads");
const Product = require("../models/product");
const categorys = require("../models/category");
const User = require("../models/user");
const order = require("../models/order");
const methodOverride = require("method-override");
router.use(methodOverride("_method"));

function verfiyToken(req, res, next) {
  const token = req.query.token;
  if (!token) {
    return res.status(401).json({ err: "No Token found" });
  }

  jwt.verify(token, "O!$$6S!!m$$1010A67A23", (err, uid) => {
    if (err) {
      return res.status(401).json({ msg: "Invalid Token" });
    } else {
      req.userId = uid.userId;
      next();
    }
  });
}

router.get("/Register", (req, res) => {
  res.render("user/userRegister");
});

router.get("/userInfo/:UID", async (req, res) => {
  try {
    const userId = req.params.UID;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.render("user/adduserinfo", { user: user });
  } catch (err) {}
});

router.put("/adduserinfo/:UID", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.UID;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const { paymentMethod, phone } = req.body;
    user.paymentMethod = paymentMethod;
    user.phone = phone;
    user.image = req.file ? req.file.filename : null;

    await user.save();

    res.redirect(`/userDashbord/${userId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/login", (req, res) => {
  res.render("user/userLogin");
});

router.get("/userDashbord/:UID", async (req, res) => {
  try {
    const userId = req.params.UID;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    const orderData = await order.find({ UID: userId });
    const countorder = await order.find({ UID: userId }).countDocuments();
    res.render("user/userDashbord", {
      user: user,
      order: orderData,
      count: countorder,
    });
  } catch (err) {}
});

router.post("/userRegister", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const matcheduser = await User.findOne({
      email: email,
      username: username,
    });
    if (matcheduser) {
      res.redirect("/Register");
    } else if (!matcheduser) {
      bcrypt.hash(password, 10).then((hash) => {
        User.create({
          username: username,
          email: email,
          password: hash,
        })
          .then(() => {
            res.redirect("/login");
          })
          .catch((err) => {
            if (err) {
              res.status(400).json({ error: err });
            }
          });
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/userlogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userLogin = await User.findOne({
      username: username,
    });

    if (!userLogin) return res.status(404).send("User Not Found");
    const passwordMatch = bcrypt.compare(password, userLogin.password);
    if (!passwordMatch) return res.status(401).send("Invalid Password");
    const token = jwt.sign({ userId: userLogin._id }, "O!$$6S!!m$$1010A67A23");
    res.redirect(`/index?token=${token}`);
  } catch (error) {
    console.log(error);
  }
});

router.get("/index", verfiyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).send("User Not Found");
  } else {
    const products = await Product.find().limit(8);
    const productTypes = await Product.distinct("type");
    const lastproduct = await Product.find().sort({ _id: -1 }).limit(6);
    const category = await categorys.find();

    res.render("./index", {
      PRODUCTS: products,
      CATEGORY: category,
      PTYPE: productTypes,
      LP: lastproduct,
      user: user,
    });
  }
});
router.get("/productfilter/:gender/userId/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    } else {
      const productType = req.params.gender;
      const productFilter = await Product.find({ for: productType });
      if (productFilter) {
        res.render("store/productfilter", {
          PF: productFilter,
          user: user,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/productsCategory/:categoryID/userId/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const productType = req.params.categoryID;
    const productFilter = await Product.find({ category: productType });
    if (!productFilter || productFilter.length === 0) {
      return res.status(404).send("No products found");
    }
    res.render("store/productsCategory", { PF: productFilter, user: user });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/product/:PID/userId/:userId", async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).send("User Not Found");
  } else {
    const PID = req.params.PID;
    const selectedProduct = await Product.findById(PID);
    console.log(user);
    if (selectedProduct) {
      res.render("store/product", {
        selected: selectedProduct,
        user: req.params.userId,
      });
    }
  }
});

router.post("/order/:PID/userId/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User Not Found");
    }

    if (user.paymentMethod === "") {
      return res.status(404).send("Add Payment Method From Your Dashbord");
    }
    const { productName, quntity, color, size, price } = req.body;

    const newOrder = new order({
      PID: req.params.PID,
      UID: userId,
      Username: user.username,
      productName: productName,
      qauntity: quntity,
      color: color,
      size: size,
      price: price,
      paymentMethod: user.paymentMethod,
    });

    console.log(newOrder);

    const product = await Product.findById(req.params.PID);
    if (!product) {
      return res.status(404).send("Product Not Found");
    }

    const updatedQuantity = product.quantity - parseInt(quntity);
    const updatedSpent = user.spent + parseInt(price) * parseInt(quntity);
    if (updatedQuantity < 0) {
      return res.status(400).send("Not enough quantity available");
    }

    product.quantity = updatedQuantity;
    user.spent = updatedSpent;

    await product.save();
    await user.save();
    await newOrder.save();

    res.redirect(`/userDashbord/${userId}`);
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/allproduct/userId/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) {
    return res.status(404).send("NO user Found");
  }
  const allProducts = await Product.find();
  if (allProducts) {
    res.render("store/allproduct", { all: allProducts, user: user });
  }
});

router.get("/cart/userId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("No User Found");
    }

    const totalOrders = await order.countDocuments({ UID: userId });
    const totalPages = Math.ceil(totalOrders / limit);
    const skip = (page - 1) * limit;

    const userOrders = await order
      .find({ UID: userId })
      .skip(skip)
      .limit(limit);

    res.render("store/cart", {
      UO: userOrders,
      user: user,
      totalOrders: totalOrders,
      totalPages: totalPages,
      currentPage: page,
      limit: limit,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
