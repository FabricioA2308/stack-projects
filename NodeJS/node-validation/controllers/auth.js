// const { reset } = require("nodemon");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const { throwError } = require("./admin");

const transporter = nodemailer.createTransport({
  host: "placeholder",
  port: 2525,
  auth: {
    user: "placeholder",
    pass: "placeholder",
  },
});

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
    validationErrors: [],
    oldInput: {
      email: "",
      password: "",
    },
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid email or password.",
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Invalid email or password.",
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors: [],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      throwError(err, next);
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword: req.body.confirmPassword },
      validationErrors: errors.array(),
    });
  }
  return bcrypt
    .hash(password, 12)
    .then((hashPassword) => {
      const user = new User({
        email,
        password: hashPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      return transporter.sendMail({
        to: email,
        from: "shop@node-complete.com",
        subject: "Signup succeeded!",
        html: "<h1>You sucessfully signed up!</h1>",
      });
    })
    .catch((err) => throwError(err, next));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      req.flash("error", "Something went wrong! Try again later.");
      res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          req.flash("error", "Email not found.");
          return res.redirect("/reset");
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: email,
          from: "shop@node-complete.com",
          subject: "Password reset",
          html: `
            <p>You request a password reset</p>
            <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set a new password'
          `,
        });
      })
      .catch((err) => throwError(err, next));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }

      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New password",
        errorMessage: message,
        passwordToken: token,
        userId: user._id.toString(),
      });
    })
    .catch((err) => throwError(err, next));
};

exports.postNewPassword = (req, res, next) => {
  const { newPassword, userId, passwordToken } = req.body;
  let user;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((foundUser) => {
      user = foundUser;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      user.password = hashedPassword;
      user.resetToken = undefined;
      user.resetTokenExpiration = undefined;
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => throwError(err, next));
};
