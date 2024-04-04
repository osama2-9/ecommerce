const express = require("express");
const router = express.Router();
const product = require("../models/product");
const category = require("../models/category");
const uploads = require("../uploads");
router.use(express.json());

router.get("/addproducts", async (req, res) => {
  try {
    const categorys = await category.find();
    res.render("admin/addproducts", { category: categorys });
  } catch (err) {
    console.log(err);
  }
});

router.post("/addproduct", uploads.array("images", 5), async (req, res) => {
  try {
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
      res.redirect("adminDashbord");
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
    const perPage = 7;
    const page = req.query.page || 1;
   

    const allProducts = await product
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage);

    const totalProducts = await product.countDocuments();

    res.render("admin/showproduct", {
      PRODUCT: allProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / perPage),
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/editproduct/:PID", async (req, res) => {
  try {
    const PID = req.params.PID;
    const editproducData = await product.findById({ _id: PID }, req.body);
    const allCategory = await category.find();
    if (editproducData) {
      res.render("admin/editproduct", {
        PTU: editproducData,
        category: allCategory,
      });
    }
  } catch (err) {
    console.log(err);
  }
});
router.put("/product/:PID", async (req, res) => {
  try {
    const data = req.body;
    const PID = req.params.PID;
    console.log(data);
    const updateProduct = await product.updateOne({ _id: PID }, data);

    if (updateProduct) {
      console.log(data);

      res.redirect("/showproducts");
    } else {
      res.status(404).send("Product not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/deleteproduct/:productID", async (req, res) => {
  const productID = req.params.productID;
  const ifDelete = await product.deleteOne({ _id: productID });
  if (ifDelete) {
    res.redirect("/showproducts");
  } else {
    res.redirect("/showproducts");
  }
});

router.get("/showFullProduct/:PID", async (req, res) => {
  const PID = req.params.PID;
  const Pdata = await product.findById({ _id: PID });
  if (Pdata) {
    res.render("admin/showFullProduct", { PD: Pdata });
  }
});
module.exports = router;
