const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

exports.getStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((user) => {
      res.status(200).json({ status: user.status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.updateStatus = (req, res, next) => {
  const { status } = req.body;
  console.log(req.body);

  User.findById(req.userId)
    .then((user) => {
      console.log(user);
      user.status = status;
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Updated status successfully.", status });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.getPosts = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  let totalItems;

  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res
        .status(200)
        .json({ message: "Fetched posts successfully.", posts, totalItems });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }

      next(err);
    });
};

exports.postNewPosts = (req, res, next) => {
  const errors = validationResult(req);
  const { title, content } = req.body;
  let creator;

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Please try again.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.file.path;

  User.findById(req.userId).then((user) => {
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user.name,
    });
    post
      .save()
      .then((result) => {
        return User.findById(req.userId);
      })
      .then((user) => {
        creator = user;
        console.log(creator);
        user.posts.push(post);
        return user.save();
      })
      .then((result) => {
        res.status(201).json({
          message: "Post created successfully.",
          post,
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }

        next(err);
      });
  });
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post.");
        error.statusCode = 400;
        throw error;
      }

      post.imageUrl = post.imageUrl.replace(/\\/g, "/");

      res.status(200).json({
        message: "Post found.",
        post,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error("Validation failed. Please try again.");
    error.statusCode = 422;
    throw error;
  }

  const postId = req.params.postId;
  const { title, content } = req.body;

  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No file picked.");
    error.statusCode = 422;
    throw error;
  }

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found.");
        error.statusCode = 404;
        throw error;
      }

      if (post.creator.toString() !== req.userId) {
        const error = new Error("Unauthorized.");
        error.statusCode = 403;
        throw error;
      }

      if (imageUrl !== post.imageUrl) {
        clearImage(post.imageUrl);
      }

      post.title = title;
      post.imageUrl = imageUrl;
      post.content = content;

      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated.", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  let foundPost;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("No post found.");
        error.statusCode = 404;
        throw error;
      }

      foundPost = post;
      return User.findById(req.userId);
    })
    .then((user) => {
      if (foundPost.creator !== user.name) {
        const error = new Error("Unauthorized.");
        error.statusCode = 403;
        throw error;
      }
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      clearImage(post.imageUrl);
      return Post.findByIdAndDelete(postId);
    })
    .then((result) => {
      res.status(200).json({ message: "Deleted post." });
    })
    .catch((err) => {
      console.log(err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
