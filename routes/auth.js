const express = require("express");
const router = express.Router();
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");

router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email address.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          console.log(user, "here");
          if (user) {
            return Promise.reject("Email address exists already.");
          }
          console.log("hellp");
        });
      })
      .normalizeEmail(),

    body(
      "password",
      "Please enter a password with only numbers and text and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],
  authController.postSignup
);

router.post(
  "/login",
  body("email").isEmail().normalizeEmail(),
  authController.postLogin
);

router.get("/logout", authController.postLogout);

module.exports = router;
