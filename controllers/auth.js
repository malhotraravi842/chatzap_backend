require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { validationResult } = require("express-validator");
const { throwErr } = require("../utils");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: "Invalid email or password" });
  }
  let userData;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ message: "Invalid email or password" });
      }
      userData = user;
      return bcrypt.compare(password, user.password);
    })
    .then((doMatch) => {
      if (doMatch) {
        const token = jwt.sign(
          {
            user_id: userData._id,
            email,
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: "1h",
          }
        );

        userData.token = token;
        return userData.save();
      } else {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    })
    .then((user) => {
      return res.status(200).json({
        message: "You haved logged in successully.",
        token: user.token,
      });
    })
    .catch((err) => {
      throwErr(err, next);
    });
};

exports.postLogout = (req, res, next) => {
  res.send("<h1>You are logged out</h1>");
};

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(403).json({ message: errors.array()[0].msg });
  }

  const { email, fullName, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email: email,
        password: hashedPass,
        fullName: fullName,
      });

      return user.save();
    })
    .then((user) => {
      res.status(201).json({
        message: "Congratulations, You have successfully signed up.",
        data: {
          email: user.email,
          fullName: user.fullName,
        },
      });
    })
    .catch((err) => {
      throwErr(err, next);
    });
};
