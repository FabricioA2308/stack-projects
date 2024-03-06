const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const bodyparser = require("body-parser");
const multer = require("multer");

const feedRoutes = require("./routes/feed");
const authRoutes = require("./routes/auth");

const app = express();

let mongoURI = "placeholder";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filenamge: (req, file, cb) => {
    cb(null, uuidv4 + "-" + file.originalName);
  },
});

// filters what kind of file is accepted
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyparser.json()); // for parsing requests with the content-type header application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// GET /feed/posts
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);

// top-level error handling middleware
app.use((error, req, res, next) => {
  console.log(error);

  const { status, message, data } = error;

  res.status(status).json({ message: message, data });
});

mongoose
  .connect(mongoURI)
  .then((result) => app.listen(8080))
  .catch((err) => console.log(err));
