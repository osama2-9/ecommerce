const express = require("express");
const router = express.Router();
const product = require("../models/product");
const category = require("../models/category");
const uploads = require("../uploads");
router.use(express.json());
const methodOverride = require("method-override");
router.use(methodOverride("_method"));
router.get("/addproducts", async (req, res) => {
  try {
    const token = req.cookies.lcfa;
    const categorys = await category.find();
    res.render(`admin/addproducts`, { category: categorys, AT: token });
  } catch (err) {
    console.log(err);
  }
});

router.post("/addproduct", uploads.array("images", 5), async (req, res) => {
  try {
    const token = req.cookies.lcfa;
    const {
      productName,
      quantity,
      price,
      description,
      colors,
      sizes,
      categoryID,
      type,
      gender,
    } = req.body;
    const images = req.files.map((file) => file.filename);
    const colorsArray = colors.split(",").map((color) => color.trim());
    const sizesArray = sizes.split(",").map((size) => size.trim());

    const newProduct = await product.create({
      productName,
      quantity,
      type: type,
      price,
      gender: gender,
      description,
      colors: colorsArray,
      sizes: sizesArray,
      images,
      category: categoryID,
      for: gender,
    });

    if (newProduct) {
      res.redirect(`adminDashbord?token=${token}`);
    } else {
      res.status(500).send("Failed to add product");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error occurred while adding product");
  }
});
router.get("/showproducts", async (req, res) => {
  try {
    const token = req.cookies.lcfa;
    const perPage = 7;
    const page = req.query.page || 1;

    const allProducts = await product
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await product.countDocuments();
    const allCategory = await category.find();
    res.render(`admin/showproduct`, {
      PRODUCT: allProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / perPage),
      AT: token,
      category: allCategory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/editproduct/:PID", async (req, res) => {
  try {
    const token = req.cookies.lcfa;
    const PID = req.params.PID;
    const editproducData = await product.findById({ _id: PID }, req.body);
    const allCategory = await category.find();
    if (editproducData) {
      res.render(`admin/editproduct`, {
        PTU: editproducData,
        category: allCategory,
        AT: token,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
router.put("/productUpdate/:productId", async (req, res) => {
  const productId = req.params.productId;
  const updates = req.body;

  try {
    const updatedProduct = await product.findByIdAndUpdate(productId, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/deleteproduct/:productID", async (req, res) => {
  const token = req.cookies.lcfa;
  const productID = req.params.productID;
  const ifDelete = await product.deleteOne({ _id: productID });
  if (ifDelete) {
    res.redirect(`/showproducts?token=${token}`);
  } else {
    res.redirect(`/showproducts?token=${token}`);
  }
});

router.get("/showFullProduct/:PID", async (req, res) => {
  const token = req.cookies.lcfa;
  const PID = req.params.PID;
  const Pdata = await product.findById({ _id: PID });
  if (Pdata) {
    res.render(`admin/showFullProduct`, {
      PD: Pdata,
      AT: token,
    });
  }
});
module.exports = router;
