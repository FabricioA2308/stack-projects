const express = require("express");
const { body } = require("express-validator");

const feedController = require("../controllers/feed");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/status", isAuth, feedController.getStatus);

router.put("/status/update", isAuth, feedController.updateStatus);

router.get("/posts", isAuth, feedController.getPosts);

router.post(
  "/post",
  [
    body("title").trim().isString().isLength({ min: 5, max: 140 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  isAuth,
  feedController.postNewPosts
);

router.get("/post/:postId", isAuth, feedController.getSinglePost);

router.put(
  "/post/:postId",
  [
    body("title").trim().isString().isLength({ min: 5, max: 140 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete("/post/:postId", isAuth, feedController.deletePost);

module.exports = router;
