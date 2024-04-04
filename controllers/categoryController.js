const express = require("express");
const router = express.Router();
const category = require("../models/category");
 


const product = require("../models/product");
router.get("/addcategory", async (req, res) => {
  res.render("admin/addcategory");
});

router.post("/addcategory", async (req, res) => {
  try {
    console.log(req.body);
    const createCategory = await category.create(req.body);
    if (createCategory) {
      res.redirect("adminDashbord");
    }
  } catch (err) {
    console.log(err);
  }
});
router.get("/categorys/:categoryId/products", async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categ = await category.findById(categoryId);
    if (!categ) {
      return res.status(404).json({ error: "Category not found" });
    }
    const products = await product.find({ category: categoryId });
    res.render("admin/category", { POC: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/showcategory", async (req, res) => {
  try {
    const token = req.cookies.lcfa;
    const allCategory = await category.find();
    if (allCategory) {
      res.render("admin/showcategory", { categorys: allCategory, AT: token });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/deletecateogry/:CID", async (req, res) => {
  try {
    const CID = req.params.CID;
    const DeletePromise = await Promise.all([
      category.findByIdAndDelete(CID),
      product.deleteMany({ category: CID }),
    ]);

    if (DeletePromise) {
      res.redirect("/showproducts");
    } else {
      res.send({ msg: "Error While Delete" });
    }
  } catch (error) {
    res.send("<h1>Error Happend Try Again Later !</h1>");
  }
});
module.exports = router;
