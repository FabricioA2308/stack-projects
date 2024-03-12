const User = require("../models/user");
const Post = require("../models/post");
const { clearImage } = require("../util/file");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

module.exports = {
  posts: async function ({ page }, req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated.");
    //   error.code = 401;
    //   throw error;
    // }

    if (!page) {
      page = 1;
    }

    const perPage = 2;
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");
    const totalPosts = await Post.find().countDocuments();

    return {
      posts: posts.map((post) => {
        return {
          ...post._doc,
          _id: post._id.toString(),
          createdAt: post.createdAt.toISOString(),
          updatedAt: post.updatedAt.toISOString(),
        };
      }),
      totalPosts,
    };
  },

  post: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("Post not found.");
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  createUser: async function (args, req) {
    const { email, name, password } = args.userInput;
    const existingUser = await User.findOne({ email: email });

    const errors = [];

    if (!validator.isEmail(email)) {
      errors.push({ message: "Email is invalid." });
    }

    if (
      validator.isEmpty(password) ||
      !validator.isLength(passowrd, { min: 5 })
    ) {
      errors.push({ message: "Invalid password. Please try again." });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.code = 422;
      throw error;
    }

    if (existingUser) {
      const error = new Error("User exists already!");
      error.data = errors;
      error.code = 422;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, name, password: hashedPassword });

    const createdUser = await user.save();
    return {
      ...createdUser._doc,
      _id: createdUser._id.toString(),
    };
  },

  login: async function ({ email, password }) {
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found.");
      error.code = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Incorrect password.");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email,
      },
      "somesupersecretsecret",
      { expiresIn: "1h" }
    );

    return { token, userId: user._id.toString() };
  },

  createPost: async function ({ postInput }, req) {
    const errors = [];
    const { title, content, imageUrl } = postInput;

    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: "Title is invalid!" });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid!" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("Invalid user.");
      error.code = 401;
      throw error;
    }

    const post = new Post({ title, content, imageUrl, creator: user });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();

    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      createdAt: createdPost.updatedAt.toISOString(),
    };
  },

  updatePost: async function ({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id).populate("creator");

    if (!post) {
      const error = new Error("Post not found.");
      error.code = 404;
      throw error;
    }

    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized.");
      error.code = 403;
      throw error;
    }

    const errors = [];
    const { title, content, imageUrl } = postInput;

    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    if (validator.isEmpty(title) || !validator.isLength(title, { min: 5 })) {
      errors.push({ message: "Title is invalid!" });
    }

    if (
      validator.isEmpty(content) ||
      !validator.isLength(content, { min: 5 })
    ) {
      errors.push({ message: "Content is invalid!" });
    }

    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      throw error;
    }

    if (imageUrl !== "undefined") {
      post.imageUrl = imageUrl;
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();

    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      createdAt: updatedPost.updatedAt.toISOString(),
    };
  },

  delete: async function ({ id }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    const post = await Post.findById(id);

    if (!post) {
      const error = new Error("Post not found.");
      error.code = 404;
      throw error;
    }

    if (post.creator.toString() !== req.userId.toString()) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(id);

    const user = await User.findById(post.creator);
    user.posts.pull(id);
    await user.save();

    return true;
  },

  getStatus: async function (args, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    const user = await User.findById(req.userId);

    if (!user) {
      const error = new Error("User not found.");
      error.code = 404;
      throw error;
    }

    return { ...user._doc, _id: user._id.toString() };
  },

  updateStatus: async function ({ status }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated.");
      error.code = 401;
      throw error;
    }

    try {
      const user = await User.findById(req.userId);

      if (!user) {
        const error = new Error("User not found.");
        error.code = 404;
        throw error;
      }

      user.status = status;

      await user.save();

      return { ...user._doc, _id: user._id.toString() };
    } catch (err) {
      throw err;
    }
  },
};
