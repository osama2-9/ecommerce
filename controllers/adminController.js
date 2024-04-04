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

function verifyAdminToken(req, res, next) {
  const token = req.query.token;
  if (!token) {
    return res.status(404).json({ msg: "NO TOKEN FOUND !" });
  }
  jwt.verify(token, "O!$$6S!!m$$1010A67A23", (err, aid) => {
    if (err) {
      return res.status(404).json({ err: err });
    } else {
      req.AID = aid.AID;
      next();
    }
  });
}

router.get("/adminLogin", (req, res) => {
  res.render("admin/adminLogin");
});

router.post("/adminLogin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const isAdmin = await ADMIN.findOne({ username: username, type: "Normal" });
    if (!isAdmin) {
      return res.status(404).send("No Admin Found");
    }
    const passwordMatch = bcrypt.compare(password, isAdmin.password);
    if (!passwordMatch) {
      return res.status(401).send("Password does not match");
    }
    const token = jwt.sign({ AID: isAdmin._id }, "O!$$6S!!m$$1010A67A23");

    res.redirect(`/adminDashbord?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/adminDashbord", verifyAdminToken, async (req, res) => {
  try {
    const admin = await ADMIN.findById(req.AID);
    const adminToken = req.query.token;
    if (!admin) {
      return res.status(404).send("No Admin Found");
    }
    res.cookie("lcfa", adminToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
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
    const allOrderCounter = await order.countDocuments({});
    res.render(`admin/adminDashbord`, {
      AT: adminToken,
      DATA: admin,
      PCounter: counter,
      categoryCount: categoryCounter,
      CustomerCounter: customerCounter,
      allOrder: allOrderCounter,
      orderPerDay: orders,
      dateFormat,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
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

router.get("/customers", verifyAdminToken, async (req, res) => {
  try {
    const CDATA = await users.find();
    const token = req.cookies.lcfa;

    if (CDATA) {
      res.render("admin/Customers", { CD: CDATA, AT: token });
    }
  } catch (error) {}
});

router.get("/orders", verifyAdminToken, async (req, res) => {
  const itemsperpage = 8;
  try {
    const page = parseInt(req.query.page) || 1;
    const totalOrders = await order.countDocuments();
    const totalPages = Math.ceil(totalOrders / itemsperpage);
    const token = req.cookies.lcfa;
    const orders = await order
      .find()
      .skip((page - 1) * itemsperpage)
      .limit(itemsperpage);
    res.render("admin/allorder", {
      orders: orders,
      totalPages: totalPages,
      currentPage: page,
      AT: token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
