const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const { graphqlHTTP } = require("express-graphql");

const bodyparser = require("body-parser");
const multer = require("multer");
const graphQlSchema = require("./graphql/schema");
const graphQlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file");

const app = express();

let mongoURI =
  "placeholder";

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images"); // where will be storaged
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

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.put("/post-image", (req, res, next) => {
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored.", filePath: req.file.path });
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error ocurred";
      const code = err.originalError.code || 500;

      return {
        message,
        status: code,
        data,
      };
    },
  })
);

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
