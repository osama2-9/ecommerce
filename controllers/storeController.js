const express = require("express");
const router = express.Router();
const product = require("../models/product");
const categorys = require("../models/category");
const User = require("../models/user");

router.get("/", async (req, res) => {
  const user = req.user;
  const products = await product.find().limit(8);
  const productTypes = await product.distinct("type");
  const lastproduct = await product.find().sort({ _id: -1 }).limit(6);
  const category = await categorys.find();

  res.render("./index", {
    PRODUCTS: products,
    CATEGORY: category,
    PTYPE: productTypes,
    LP: lastproduct,
    user: user,
  });
});

router.get("/product/:PID/userId/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const PID = req.params.PID;
    const selectedProduct = await product.findById(PID);
    console.log(userId);
    if (selectedProduct) {
      res.render("store/product", { selected: selectedProduct, user: userId });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:PID", async (req, res) => {
  try {
    const userId = req.params.userId;
    const PID = req.params.PID;
    const selectedProduct = await product.findById(PID);
    console.log(userId);
    if (selectedProduct) {
      res.render("store/product", { selected: selectedProduct, user: userId });
    } else {
      res.status(404).send("Product not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/productFilter/:gender", async (req, res) => {
  const user = await User.findById(req.userId);
  const productType = req.params.gender;
  const productFilter = await product.find({ for: productType });
  if (productFilter) {
    res.render("store/productFilter", { PF: productFilter, user: user });
  }
});

router.get("/productsCategory/:categoryID", async (req, res) => {
  const user = await User.findById(req.userId);
  const productType = req.params.categoryID;
  const productFilter = await product.find({ category: productType });
  if (productFilter) {
    res.render("store/productsCategory", { PF: productFilter, user: user });
  }
});

router.get("/allproduct", async (req, res) => {
  const user = await User.findById(req.userId);
  const allProducts = await product.find();
  if (allProducts) {
    res.render("store/allproduct", { all: allProducts, user: user });
  }
});


module.exports = router;
