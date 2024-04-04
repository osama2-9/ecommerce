const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const ADMIN = require("../models/admin");
const product = require("../models/product");
const category = require("../models/category");
const users = require("../models/user");
const order = require("../models/order");
const uploads = require("../uploads");
const moment = require("moment");
function dateFormat(date) {
  const formattedDate = moment(date).format("Y-M-D");
  return formattedDate;
}

function verifySuperAdminToken(req, res, next) {
  const token = req.query.token;
  if (!token) {
    return res.status(404).json({ msg: "NO TOKEN FOUND !" });
  }
  jwt.verify(token, "A@@D!!M&&I^^N", (err, said) => {
    if (err) {
      return res.status(404).json({ err: err });
    } else {
      req.SAID = said.SAID;
      next();
    }
  });
}

router.get("/addadmin", verifySuperAdminToken, async (req, res) => {
  const admin = await ADMIN.findById(req.SAID);
  if (!admin) {
    return res.status(404).send("No Admin Found");
  }
  res.render("admin/addadmin", {
    AT: req.query.token,
    admin: admin,
  });
});

router.post("/addadmin", uploads.single("photo"), async (req, res) => {
  try {
    const refeereURL = req.get("referer");
    const token = req.cookies.lcfa;
    const { username, email, password, type } = req.body;
    const photo = req.file ? req.file.path : null;
    const matchAdmin = await ADMIN.findOne({
      username: username,
      email: email,
    });
    if (matchAdmin) {
      return res.redirect(refeereURL);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createNewAdmin = await ADMIN.create({
      username: username,
      email: email,
      password: hashedPassword,
      photo: photo,
      type: type,
    });
    if (createNewAdmin) {
      res.redirect(`/superAdminDashbord?token=${token}`);
    }

    console.log(hashedPassword);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/edit/:ID", verifySuperAdminToken, async (req, res) => {
  try {
    const ID = req.params.ID;
    const adminToUpdate = await ADMIN.findById({ _id: ID });
    if (adminToUpdate) {
      res.render("admin/edit", { adminToUpdate: adminToUpdate });
    } else {
    }
  } catch (err) {
    console.log(err);
  }
});

router.put("/edit/:ID", async (req, res) => {
  try {
    const data = req.body;
    const ID = req.params.ID;
    const updatedAdmin = await ADMIN.findByIdAndUpdate(ID, data);
    console.log(data);
    console.log(ID);
    console.log(updatedAdmin);
    if (updatedAdmin) {
      res.redirect("/adminDashbord");
    }
  } catch (err) {
    console.log(err);
  }
});
router.delete("/delete/:ID", async (req, res) => {
  try {
    const ID = req.params.ID;
    console.log(ID);
    const deleteAdmin = await ADMIN.deleteOne({ _id: ID });
    if (deleteAdmin) {
      res.redirect("/adminDashbord");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/customers", verifySuperAdminToken, async (req, res) => {
  try {
    const CDATA = await users.find();
    if (CDATA) {
      res.render("admin/Customers", { CD: CDATA });
    }
  } catch (error) {}
});

router.get("/orders", verifySuperAdminToken, async (req, res) => {
  const itemsperpage = 8;
  try {
    const page = parseInt(req.query.page) || 1;
    const totalOrders = await order.countDocuments();
    const totalPages = Math.ceil(totalOrders / itemsperpage);
    const orders = await order
      .find()
      .skip((page - 1) * itemsperpage)
      .limit(itemsperpage);

    res.render("admin/allorder", {
      orders: orders,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/superAdminLogin", (req, res) => {
  res.render("admin/superAdminLogin");
});
router.post("/SAL", async (req, res) => {
  try {
    const { username, password } = req.body;
    const superAdmin = await ADMIN.findOne({
      username: username,
      type: "Super",
    });
    if (!superAdmin) {
      return res.status(404).send("NO ADMIN FOUND");
    }
    const hashedPassword = bcrypt.compare(password, superAdmin.password);
    if (!hashedPassword) {
      return res.status(401).send("Password does not match");
    }
    const superAdminToken = jwt.sign({ SAID: superAdmin._id }, "A@@D!!M&&I^^N");
    res.redirect(`/superAdminDashbord?token=${superAdminToken}`);
  } catch (err) {
    console.log(err);
  }
});

router.get("/superAdminDashbord", verifySuperAdminToken, async (req, res) => {
  try {
    const token = req.query.token;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); 
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const orders = await order.find({
      createdAt: { $gte: currentDate, $lte: endDate },
    });
    const counter = await product.countDocuments({});
    const categoryCounter = await category.countDocuments({});
    const customerCounter = await users.countDocuments({});
    const AdminCounter = await ADMIN.countDocuments({ type: "Normal" });
    const allOrderCounter = await order.countDocuments({});
    res.render("admin/superAdminDashbord", {
      SAT: token,
      PCounter: counter,
      categoryCount: categoryCounter,
      CustomerCounter: customerCounter,
      allOrder: allOrderCounter,
      orderPerDay: orders,
      dateFormat,
      AdminCounter,
    });
  } catch (err) {
    console.log(err.message);
  }
});
module.exports = router;
