const path = require("path");

const express = require("express");
const { check } = require("express-validator/check");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  check("title", "Title must have more than 4 characters!")
    .isString()
    .trim()
    .isLength({ min: 4 }),
  check("imageUrl", "Not a valid URL.").trim().isURL(),
  check("price", "Invalid price. Must be a decimal.").isDecimal(),
  check("description", "Description is too short.")
    .trim()
    .isLength({ min: 5, max: 250 }),
  isAuth,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  check("title", "Title must have more than 4 characters!")
    .trim()
    .isLength({ min: 4 }),
  check("imageUrl", "Not a valid URL.").trim().isURL(),
  check("price", "Invalid price. Must be a decimal.").isDecimal(),
  check("description", "Description is too short.")
    .trim()
    .isLength({ min: 5, max: 250 }),
  isAuth,
  adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
