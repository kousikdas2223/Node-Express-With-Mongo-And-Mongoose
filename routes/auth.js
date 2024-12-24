const express = require("express");
const { check, body } = require("express-validator");
const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  body(
    "password",
    "Password must be more than 8 character in length and alphanumeric"
  )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  authController.postLogin
);

router.post(
  "/signup",
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom((value, { req }) => {
      // if(value === 'test@test.com'){
      //     throw new Error('This email address is forbidden');
      // }
      // return true;
      return User.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject(
            "Email already exists! Please use a different email"
          );
        }
      });
    }),
  body(
    "password",
    "Password must be more than 8 character in length and alphanumeric"
  )
    .isLength({ min: 8 })
    .isAlphanumeric()
    .trim(),
  //Alternative
  // .isLength({min: 8}).withMessage('Password must be more than 8 character in length')
  // .isAlphanumeric().withMessage('Password must be alphanumeric'),
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords have to match");
    }
    return true;
  }),
  authController.postSignup
);

router.post("/logout", authController.postLogout);

module.exports = router;
