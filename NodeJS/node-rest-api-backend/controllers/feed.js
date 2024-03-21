const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const Post = require("../models/post");
const User = require("../models/user");

exports.getStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ status: user.status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.updateStatus = async (req, res, next) => {
  const { status } = req.body;
  console.log(req.body);

  try {
    const user = await User.findById(req.userId);
    user.status = status;
    await user.save();

    res.status(200).json({ message: "Updated status successfully.", status });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = Post.find().countDocuments();

    const posts = Post.find()
      .populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res
      .status(200)
      .json({ message: "Fetched posts successfully.", posts, totalItems });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.postNewPosts = async (req, res, next) => {
  const errors = validationResult(req);
  const { title, content } = req.body;

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

  try {
    const user = await User.findById(req.userId);
    const post = new Post({
      title,
      content,
      imageUrl,
      creator: user.name,
    });
    await post.save();

    user.posts.push(post);

    const savedUser = await user.save();

    res.status(201).json({
      message: "Post created successfully.",
      post,
    });

    return savedUser;
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

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
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
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

  try {
    const post = await Post.findById(postId);

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

    await post.save();

    res.status(200).json({ message: "Post updated.", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error("No post found.");
      error.statusCode = 404;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (post.creator !== user.name) {
      const error = new Error("Unauthorized.");
      error.statusCode = 403;
      throw error;
    }
    user.posts.pull(postId);
    await user.save();

    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Deleted post." });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
